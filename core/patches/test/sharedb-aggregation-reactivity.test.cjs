const assert = require('node:assert/strict')
const test = require('node:test')
const { EventEmitter } = require('node:events')
const fs = require('node:fs')

const ShareDB = require('sharedb')
const QueryEmitter = require('sharedb/lib/query-emitter')
const SubmitRequest = require('sharedb/lib/submit-request')

test('patched query emitter has no undeclared runtime dependency on mingo', () => {
  const source = fs.readFileSync(require.resolve('sharedb/lib/query-emitter'), 'utf8')

  assert.doesNotMatch(source, /require\(['"]mingo['"]\)/)
})

test('resolved named aggregation subscribes to lookup collection channels', async () => {
  const backend = new ShareDB()
  const agent = { custom: {} }
  backend.use('query', (request, next) => {
    request.query = {
      $aggregate: [
        { $match: { _id: 'course-1' } },
        { $lookup: { from: 'stores', localField: '_id', foreignField: 'courseId', as: 'stores' } }
      ]
    }
    next()
  })

  const request = await triggerQuery(backend, agent, 'courses', {
    $aggregationName: '_playerOutline',
    $params: { courseId: 'course-1' }
  })

  assert.deepEqual(request.channels, [
    backend.getCollectionChannel('courses'),
    backend.getCollectionChannel('stores')
  ])
})

test('aggregation fallback polls for a mutation in a lookup collection', () => {
  const emitter = createEmitter({
    db: { skipPoll: () => true }
  })
  let polls = 0
  emitter.queryPoll = () => { polls++ }

  emitter._update({
    d: 'store-1',
    _cs: {
      collection: 'stores',
      operationType: 'update',
      fullDocumentBeforeChange: { _id: 'store-1', courseId: 'course-1' },
      fullDocument: { _id: 'store-1', courseId: 'course-1' }
    }
  })

  assert.equal(polls, 1)
})

test('regular query preserves the database skipPoll contract', () => {
  const calls = []
  const query = { courseId: 'course-1' }
  const emitter = createEmitter({
    query,
    db: {
      canPollDoc: () => false,
      queryPoll: () => {},
      skipPoll (...args) {
        calls.push(args)
        return true
      }
    }
  })
  let polls = 0
  emitter.queryPoll = () => { polls++ }

  emitter._update({ d: 'lesson-1', op: [] })

  assert.equal(polls, 0)
  assert.equal(calls.length, 1)
  assert.equal(calls[0][0], 'courses')
  assert.equal(calls[0][3], query)
})

test('server skipPoll policy receives lookup mutation metadata and can suppress poll', () => {
  const calls = []
  const emitter = createEmitter({
    options: {
      skipPoll (rootCollection, id, op, query, metadata) {
        calls.push({ rootCollection, id, metadata })
        return metadata.collection === 'stores' && metadata.fullDocument.courseId !== 'course-1'
      }
    }
  })
  let polls = 0
  emitter.queryPoll = () => { polls++ }

  emitter._update({
    d: 'store-2',
    _cs: {
      collection: 'stores',
      operationType: 'update',
      fullDocumentBeforeChange: { _id: 'store-2', courseId: 'course-2' },
      fullDocument: { _id: 'store-2', courseId: 'course-2' }
    }
  })

  assert.equal(polls, 0)
  assert.equal(calls.length, 1)
  assert.equal(calls[0].rootCollection, 'courses')
  assert.equal(calls[0].metadata.collection, 'stores')
})

test('internal mutation metadata is stripped before an operation is sent to a client', async () => {
  const backend = new ShareDB()
  const op = {
    d: 'course-1',
    op: [],
    _cs: {
      collection: 'courses',
      operationType: 'update',
      fullDocumentBeforeChange: { _id: 'course-1', secret: 'before' },
      fullDocument: { _id: 'course-1', secret: 'after' }
    }
  }

  await sanitizeOp(backend, op)

  assert.equal(op._cs, undefined)
})

test('internal mutation metadata is never persisted, including after a commit retry', async () => {
  const committedOps = []
  const publishedOps = []
  const backend = createSubmitBackend({ committedOps, publishedOps })
  const request = new SubmitRequest(
    backend,
    { custom: {} },
    'courses',
    'course-1',
    { v: 0, op: [{ p: ['title'], oi: 'After', od: 'Before' }] },
    {}
  )
  const beforeSnapshot = createSnapshot({ title: 'Before' }, 0)
  const afterSnapshot = createSnapshot({ title: 'After' }, 1)

  request.snapshot = afterSnapshot
  request._snapshotBefore = beforeSnapshot
  request.channels = ['courses']
  request.saveMilestoneSnapshot = false
  request.retry = callback => {
    request._snapshotBefore = beforeSnapshot
    request.commit(callback)
  }

  await commitRequest(request)

  assert.equal(committedOps.length, 2)
  assert.equal(committedOps[0]._cs, undefined)
  assert.equal(committedOps[1]._cs, undefined)
  assert.equal(publishedOps.length, 1)
  assert.equal(publishedOps[0]._cs.operationType, 'update')
  assert.equal(publishedOps[0]._cs.fullDocumentBeforeChange.title, 'Before')
  assert.equal(publishedOps[0]._cs.fullDocument.title, 'After')
})

function triggerQuery (backend, agent, collection, query) {
  return new Promise((resolve, reject) => {
    backend._triggerQuery(agent, collection, query, {}, (error, request) => {
      if (error) reject(error)
      else resolve(request)
    })
  })
}

function sanitizeOp (backend, op) {
  return new Promise((resolve, reject) => {
    backend.sanitizeOp({ custom: {} }, 'courses', 'course-1', op, error => {
      if (error) reject(error)
      else resolve()
    })
  })
}

function createEmitter ({ options = {}, query = createAggregationQuery(), db = {} } = {}) {
  const stream = new EventEmitter()
  stream.destroy = () => {}
  const request = {
    backend: new EventEmitter(),
    agent: { custom: {} },
    db: {
      canPollDoc: () => false,
      queryPoll: () => {},
      skipPoll: () => false,
      ...db
    },
    index: 'courses',
    query,
    collection: 'courses',
    fields: null,
    options,
    snapshotProjection: null
  }
  const emitter = new QueryEmitter(request, [stream], [], undefined)
  emitter._defaultCallback = error => {
    if (error) throw error
  }
  emitter.onError = error => { throw error }
  emitter.onOp = () => {}
  return emitter
}

function createAggregationQuery () {
  return {
    $aggregate: [
      { $match: { _id: 'course-1' } },
      { $lookup: { from: 'stores', localField: '_id', foreignField: 'courseId', as: 'stores' } }
    ]
  }
}

function createSubmitBackend ({ committedOps, publishedOps }) {
  let attempt = 0

  return {
    projections: {},
    suppressPublish: false,
    maxSubmitRetries: 1,
    MIDDLEWARE_ACTIONS: { commit: 'commit' },
    trigger (action, agent, request, callback) {
      callback()
    },
    db: {
      commit (collection, id, op, snapshot, options, callback) {
        committedOps.push({ ...op })
        attempt++
        callback(null, attempt > 1)
      }
    },
    pubsub: {
      publish (channels, op) {
        publishedOps.push({ ...op })
      }
    },
    emit () {}
  }
}

function createSnapshot (data, version) {
  return {
    id: 'course-1',
    v: version,
    type: 'http://sharejs.org/types/JSONv0',
    data,
    m: {}
  }
}

function commitRequest (request) {
  return new Promise((resolve, reject) => {
    request.commit(error => error ? reject(error) : resolve())
  })
}
