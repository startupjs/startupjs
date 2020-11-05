const assert = require('assert')
const { getDbs } = require('./db.js')
const ShareDbAccess = require('../lib/index.js')

let { backend } = getDbs()
const model = backend.createModel()

// for check request from server
model.root.connection.agent.stream.checkServerAccess = true

let shareDBAccess = new ShareDbAccess(backend)

let id

// test number so that each change is unique
let number = 1

const getTestNumber = () => {
  return number++
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
    backend.denyUpdate('tasksUpdate', async (docId, oldDoc, session, ops, newDoc) => {
      return false
    })
    backend.allowUpdate('tasksUpdate', async (docId, oldDoc, session, ops, newDoc) => {
      return false
    })

    try {
      const $task = model.at('tasksUpdate' + '.' + id)
      await $task.set('newField' + getTestNumber(), 'testInfo')
    } catch (e) {
      assert.strictEqual(e.code, 403.3)
      return
    }
    assert(false)
  })

  it('deny = false && allow = true => not err', async () => {
    backend.denyUpdate('tasksUpdate', async (docId, oldDoc, session, ops, newDoc) => {
      return false
    })
    backend.allowUpdate('tasksUpdate', async (docId, oldDoc, session, ops, newDoc) => {
      return true
    })

    try {
      const $task = model.at('tasksUpdate' + '.' + id)
      await $task.set('newField' + getTestNumber(), 'testInfo')
    } catch (e) {
      assert(false)
      return
    }
    assert(true)
  })

  it('deny = true && allow = false => err{ code: 403.3 }', async () => {
    backend.denyUpdate('tasksUpdate', async (docId, oldDoc, session, ops, newDoc) => {
      return true
    })
    backend.allowUpdate('tasksUpdate', async (docId, oldDoc, session, ops, newDoc) => {
      return false
    })

    try {
      const $task = model.at('tasksUpdate' + '.' + id)
      await $task.set('newField' + getTestNumber(), 'testInfo')
    } catch (e) {
      assert.strictEqual(e.code, 403.3)
      return
    }
    assert(false)
  })

  it('deny = true && allow = true => err{ code: 403.3 }', async () => {
    backend.denyUpdate('tasksUpdate', async (docId, oldDoc, session, ops, newDoc) => {
      return true
    })
    backend.allowUpdate('tasksUpdate', async (docId, oldDoc, session, ops, newDoc) => {
      return true
    })

    try {
      const $task = model.at('tasksUpdate' + '.' + id)
      await $task.set('newField' + getTestNumber(), 'testInfo')
    } catch (e) {
      assert.strictEqual(e.code, 403.3)
      return
    }
    assert(false)
  })
})
