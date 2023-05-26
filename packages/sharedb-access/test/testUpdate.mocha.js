const assert = require('assert')
const { getDbs } = require('./db.js')
const ShareDbAccess = require('../lib/index.js')
const { backend } = getDbs()
const model = backend.createModel()
const shareDBAccess = new ShareDbAccess(backend)
let taskId

// for check request from server
model.root.connection.agent.stream.checkServerAccess = true

describe('UPDATE', function () {
  before(async () => {
    backend.allowCreate('tasksUpdate', async (docId, doc, session) => {
      return true
    })
    backend.allowRead('tasksUpdate', async (docId, doc, session) => {
      return true
    })

    taskId = model.id()
    await model.add('tasksUpdate', { id: taskId })
  })

  beforeEach(function () {
    shareDBAccess.allow.Update.tasksUpdate = []
    shareDBAccess.deny.Update.tasksUpdate = []
  })

  it('deny = false && allow = false', async () => {
    backend.denyUpdate('tasksUpdate', async (docId, oldDoc, session, ops, newDoc) => {
      return false
    })
    backend.allowUpdate('tasksUpdate', async (docId, oldDoc, session, ops, newDoc) => {
      return false
    })

    try {
      const $task = model.at(`tasksUpdate.${taskId}`)
      await $task.set('random', Math.random())
      assert(false)
    } catch (e) {
      assert.strictEqual(e.code, 'ERR_ACCESS_DENY_UPDATE')
    }
  })

  it('deny = false && allow = true', async () => {
    backend.denyUpdate('tasksUpdate', async (docId, oldDoc, session, ops, newDoc) => {
      return false
    })
    backend.allowUpdate('tasksUpdate', async (docId, oldDoc, session, ops, newDoc) => {
      return true
    })

    try {
      const $task = model.at(`tasksUpdate.${taskId}`)
      await $task.set('random', Math.random())
      assert(true)
    } catch (e) {
      assert(false)
    }
  })

  it('deny = true && allow = false', async () => {
    backend.denyUpdate('tasksUpdate', async (docId, oldDoc, session, ops, newDoc) => {
      return true
    })
    backend.allowUpdate('tasksUpdate', async (docId, oldDoc, session, ops, newDoc) => {
      return false
    })

    try {
      const $task = model.at(`tasksUpdate.${taskId}`)
      await $task.set('random', Math.random())
      assert(false)
    } catch (e) {
      assert.strictEqual(e.code, 'ERR_ACCESS_DENY_UPDATE')
    }
  })

  it('deny = true && allow = true', async () => {
    backend.denyUpdate('tasksUpdate', async (docId, oldDoc, session, ops, newDoc) => {
      return true
    })
    backend.allowUpdate('tasksUpdate', async (docId, oldDoc, session, ops, newDoc) => {
      return true
    })

    try {
      const $task = model.at(`tasksUpdate.${taskId}`)
      await $task.set('random', Math.random())
      assert(false)
    } catch (e) {
      assert.strictEqual(e.code, 'ERR_ACCESS_DENY_UPDATE')
    }
  })
})
