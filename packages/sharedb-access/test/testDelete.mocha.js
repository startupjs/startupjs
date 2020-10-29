const assert = require('assert')
const { getDbs } = require('./db.js')
const ShareDbAccess = require('../lib/index.js')

let { backend } = getDbs()
const model = backend.createModel()

// for check request from server
model.root.connection.agent.stream.checkServerAccess = true

let taskId

let shareDBAccess = new ShareDbAccess(backend)

describe('DELETE', function () {
  before(async () => {
    backend.allowCreate('tasksDelete', async (backend, collection, docId, doc, session) => {
      return true
    })
    backend.allowRead('tasksDelete', async (backend, collection, docId, doc, session) => {
      return true
    })
  })

  beforeEach(async () => {
    taskId = model.id()
    await model.add('tasksDelete', { id: taskId, type: 'testDelete' })
  })

  afterEach(function () {
    shareDBAccess.allow.Delete.tasksDelete = []
    shareDBAccess.deny.Delete.tasksDelete = []
  })

  it('deny = false && allow = false => err{ code: 403.4 }', async () => {
    backend.denyDelete('tasksDelete', async (backend, collection, docId, doc, session) => {
      return false
    })
    backend.allowDelete('tasksDelete', async (backend, collection, docId, doc, session) => {
      return false
    })

    try {
      const $task = model.at('tasksDelete' + '.' + taskId)
      await $task.subscribe()
      await $task.del()
    } catch (e) {
      assert.strictEqual(e.code, 403.4)
      return
    }
    assert(false)
  })

  it('deny = false && allow = true => not err', async () => {
    backend.denyDelete('tasksDelete', async (backend, collection, docId, doc, session) => {
      return false
    })
    backend.allowDelete('tasksDelete', async (backend, collection, docId, doc, session) => {
      return true
    })

    try {
      const $task = model.at('tasksDelete' + '.' + taskId)
      await $task.subscribe()
      await $task.del()
    } catch (e) {
      assert(false)
      return
    }
    assert(true)
  })

  it('deny = true && allow = false => err{ code: 403.4 }', async () => {
    backend.denyCreate('tasksCreate', async (backend, collection, docId, doc, session) => {
      return true
    })
    backend.allowCreate('tasksCreate', async (backend, collection, docId, doc, session) => {
      return false
    })

    try {
      const $task = model.at('tasksDelete' + '.' + taskId)
      await $task.subscribe()
      await $task.del()
    } catch (e) {
      assert.strictEqual(e.code, 403.4)
      return
    }
    assert(false)
  })

  it('deny = true && allow = true => err{ code: 403.4 }', async () => {
    backend.denyCreate('tasksCreate', async (backend, collection, docId, doc, session) => {
      return true
    })
    backend.allowCreate('tasksCreate', async (backend, collection, docId, doc, session) => {
      return true
    })

    try {
      const $task = model.at('tasksDelete' + '.' + taskId)
      await $task.subscribe()
      await $task.del()
    } catch (e) {
      assert.strictEqual(e.code, 403.4)
      return
    }
    assert(false)
  })
})
