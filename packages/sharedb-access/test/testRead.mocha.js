const assert = require('assert')
const { getDbs } = require('./db.js')
const ShareDbAccess = require('../lib/index.js')

let { backend } = getDbs()
const model = backend.createModel()

// for check request from server
model.root.connection.agent.stream.checkServerAccess = true

let shareDBAccess = new ShareDbAccess(backend)

let taskId

const $session = model.scope('_session')
const errorTemplate = 'Permission denied (read)'

describe('READ', function () {
  before(async () => {
    backend.allowCreate('tasksRead', async (docId, doc, session) => {
      return true
    })

    taskId = model.id()
    await model.add('tasksRead', { id: taskId, type: 'testRead' })
  })

  afterEach(function () {
    shareDBAccess.allow.Read.tasksRead = []
    shareDBAccess.deny.Read.tasksRead = []
  })

  it('deny = false && allow = true => not err', async () => {
    backend.denyRead('tasksRead', async (docId, doc, session) => {
      return false
    })
    backend.allowRead('tasksRead', async (docId, doc, session) => {
      return true
    })

    try {
      const $task = model.at('tasksRead' + '.' + taskId)
      await $task.subscribe()
      $task.unsubscribe()
    } catch (e) {
      assert(false)
      return
    }
    assert(true)
  })

  it('deny = false && allow = false => err{ code: 403 }', async () => {
    backend.denyRead('tasksRead', async (docId, doc, session) => {
      return false
    })
    backend.allowRead('tasksRead', async (docId, doc, session) => {
      return false
    })

    try {
      const $task = model.at('tasksRead' + '.' + taskId)
      await $task.subscribe()
      $task.unsubscribe()

      const accessError = $session.get('_accessError')

      assert.strictEqual(accessError.message.includes(errorTemplate), true)
      assert.strictEqual(accessError.code, 403)
    } catch (e) {
      assert(false)
    }
  })

  it('deny = true && allow = false => err{ code: 403 }', async () => {
    backend.denyRead('tasksRead', async (docId, doc, session) => {
      return true
    })
    backend.allowRead('tasksRead', async (docId, doc, session) => {
      return false
    })

    try {
      const $task = model.at('tasksRead' + '.' + taskId)
      await $task.subscribe()
      $task.unsubscribe()

      const accessError = $session.get('_accessError')

      assert.strictEqual(accessError.message.includes(errorTemplate), true)
      assert.strictEqual(accessError.code, 403)
    } catch (e) {
      assert(false)
    }
  })

  it('deny = true && allow = true => err{ code: 403 }', async () => {
    backend.denyRead('tasksRead', async (docId, doc, session) => {
      return true
    })
    backend.allowRead('tasksRead', async (docId, doc, session) => {
      return true
    })
    try {
      const $task = model.at('tasksRead' + '.' + taskId)
      await $task.subscribe()
      $task.unsubscribe()

      const accessError = $session.get('_accessError')

      assert.strictEqual(accessError.message.includes(errorTemplate), true)
      assert.strictEqual(accessError.code, 403)
    } catch (e) {
      assert(false)
    }
  })
})
