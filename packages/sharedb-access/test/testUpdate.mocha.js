const assert = require('assert')
const { getDbs } = require('./db.js')
const ShareDbAccess = require('../lib/index.js')

let { backend } = getDbs()
const model = backend.createModel()

// for check request from server
model.root.connection.agent.stream.checkServerAccess = true

let shareDBAccess = new ShareDbAccess(backend)

let id

// we have to use promise for test becouse error appears in eventHendler in shareDb lib and we can't catch it with standart try...catch
// because eventHandler emit event 'error' from sharedb
// here trigger got error: https://github.com/share/sharedb/blob/116475ec89cb07988e002a9b8def138f632915b3/lib/backend.js#L196
// and than appear emit('error') https://github.com/share/sharedb/blob/116475ec89cb07988e002a9b8def138f632915b3/lib/backend.js#L91
const checkPromise = (number) => {
  return new Promise((resolve, reject) => {
    model.on('error', (error) => {
      resolve(error)
    })
    const $task = model.at('tasksUpdate' + '.' + id)
    $task.set('newField' + number, 'testInfo')
    setTimeout(() => resolve(true), 1000)
  })
}

describe('UPDATE', function () {
  before(async () => {
    backend.allowCreate('tasksUpdate', async (docId, doc, session) => {
      return true
    })
    backend.allowRead('tasksUpdate', async (docId, doc, session) => {
      return true
    })

    id = model.id()
    await model.add('tasksUpdate', { id, type: 'testUpdate' })
  })

  afterEach(function () {
    shareDBAccess.allow.Update.tasksUpdate = []
    shareDBAccess.deny.Update.tasksUpdate = []
  })

  it('deny = false && allow = false => err{ code: 403.3 }', async () => {
    backend.denyUpdate('tasksUpdate', async (docId, oldDoc, newDoc, ops, session) => {
      return false
    })
    backend.allowUpdate('tasksUpdate', async (docId, oldDoc, newDoc, ops, session) => {
      return false
    })

    const res = await checkPromise(1)
    assert.strictEqual(res.code, 403.3)
  })

  it('deny = false && allow = true => not err', async () => {
    backend.denyUpdate('tasksUpdate', async (docId, oldDoc, newDoc, ops, session) => {
      return false
    })
    backend.allowUpdate('tasksUpdate', async (docId, oldDoc, newDoc, ops, session) => {
      return true
    })

    const res = await checkPromise(2)
    assert.strictEqual(res, true)
  })

  it('deny = true && allow = false => err{ code: 403.3 }', async () => {
    backend.denyUpdate('tasksUpdate', async (docId, oldDoc, newDoc, ops, session) => {
      return true
    })
    backend.allowUpdate('tasksUpdate', async (docId, oldDoc, newDoc, ops, session) => {
      return false
    })

    const res = await checkPromise(3)
    assert.strictEqual(res.code, 403.3)
  })

  it('deny = true && allow = true => err{ code: 403.3 }', async () => {
    backend.denyUpdate('tasksUpdate', async (docId, oldDoc, newDoc, ops, session) => {
      return true
    })
    backend.allowUpdate('tasksUpdate', async (docId, oldDoc, newDoc, ops, session) => {
      return true
    })

    const res = await checkPromise(4)
    assert.strictEqual(res.code, 403.3)
  })
})
