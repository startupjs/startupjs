const assert = require('assert')
const { getDbs } = require('./db.js')
const ShareDbAccess = require('../lib/index.js')

let { backend } = getDbs()
const model = backend.createModel()

// for check request from server
model.root.connection.agent.stream.checkServerAccess = true

let shareDBAccess = new ShareDbAccess(backend)

let taskId

describe('READ', function () {
  before(async () => {
    backend.allowCreate('tasksRead', async (backend, collection, docId, doc, session) => {
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
    backend.denyRead('tasksRead', async (backend, collection, docId, doc, session) => {
      return false
    })
    backend.allowRead('tasksRead', async (backend, collection, docId, doc, session) => {
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

  it('deny = false && allow = false => err{ code: 403.2 }', async () => {
    backend.denyRead('tasksRead', async (backend, collection, docId, doc, session) => {
      return false
    })
    backend.allowRead('tasksRead', async (backend, collection, docId, doc, session) => {
      return false
    })

    try {
      const $task = model.at('tasksRead' + '.' + taskId)
      await $task.subscribe()
      $task.unsubscribe()
    } catch (e) {
      assert.strictEqual(e.code, 403.2)
      return
    }
    assert(false)
  })

  it('deny = true && allow = false => err{ code: 403.2 }', async () => {
    backend.denyRead('tasksRead', async (backend, collection, docId, doc, session) => {
      return true
    })
    backend.allowRead('tasksRead', async (backend, collection, docId, doc, session) => {
      return false
    })

    try {
      const $task = model.at('tasksRead' + '.' + taskId)
      await $task.subscribe()
      $task.unsubscribe()
    } catch (e) {
      assert.strictEqual(e.code, 403.2)
      return
    }
    assert(false)
  })

  it('deny = true && allow = true => err{ code: 403.2 }', async () => {
    backend.denyRead('tasksRead', async (backend, collection, docId, doc, session) => {
      return true
    })
    backend.allowRead('tasksRead', async (backend, collection, docId, doc, session) => {
      return true
    })
    try {
      const $task = model.at('tasksRead' + '.' + taskId)
      await $task.subscribe()
      $task.unsubscribe()
    } catch (e) {
      assert.strictEqual(e.code, 403.2)
      return
    }
    assert(false)
  })
})
