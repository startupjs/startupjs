const assert = require('assert')
const { getDbs } = require('./db.js')
const ShareDbAccess = require('../lib/index.js')
const { backend } = getDbs()
const model = backend.createModel()
const shareDBAccess = new ShareDbAccess(backend)
let taskId

// for check request from server
model.root.connection.agent.stream.checkServerAccess = true

describe('READ', function () {
  before(async () => {
    backend.allowCreate('tasksRead', async (docId, doc, session) => {
      return true
    })
    backend.allowRead('tasksRead', async (docId, doc, session) => {
      return true
    })
    taskId = model.id()
    await model.add('tasksRead', { id: taskId })
    const $task = model.at(`tasksRead.${taskId}`)
    // to make tests work correctly each test should do subscribe
    // but created doc is already subscribed and we must unsubscribe from it
    // sometimes unsubscribe not working without subscribe for created docs
    // because of that we do subscribe as a precaution
    await $task.subscribe()
    $task.unsubscribe()
  })

  beforeEach(async function () {
    shareDBAccess.allow.Read.tasksRead = []
    shareDBAccess.deny.Read.tasksRead = []
  })

  it('deny = false && allow = false', async () => {
    backend.denyRead('tasksRead', async (docId, doc, session) => {
      return false
    })
    backend.allowRead('tasksRead', async (docId, doc, session) => {
      return false
    })

    const $task = model.at(`tasksRead.${taskId}`)

    try {
      await $task.subscribe()
      assert(false)
    } catch (e) {
      $task.unsubscribe()
      assert.strictEqual(e.code, 'ERR_ACCESS_DENY_READ')
    }
  })

  it('deny = false && allow = true', async () => {
    backend.denyRead('tasksRead', async (docId, doc, session) => {
      return false
    })
    backend.allowRead('tasksRead', async (docId, doc, session) => {
      return true
    })

    try {
      const $task = model.at(`tasksRead.${taskId}`)
      await $task.subscribe()
      $task.unsubscribe()
      assert(true)
    } catch (e) {
      assert(false)
    }
  })

  it('deny = true && allow = false', async () => {
    backend.denyRead('tasksRead', async (docId, doc, session) => {
      return true
    })
    backend.allowRead('tasksRead', async (docId, doc, session) => {
      return false
    })

    const $task = model.at(`tasksRead.${taskId}`)

    try {
      await $task.subscribe()
      assert(false)
    } catch (e) {
      $task.unsubscribe()
      assert.strictEqual(e.code, 'ERR_ACCESS_DENY_READ')
    }
  })

  it('deny = true && allow = true', async () => {
    backend.denyRead('tasksRead', async (docId, doc, session) => {
      return true
    })
    backend.allowRead('tasksRead', async (docId, doc, session) => {
      return true
    })

    const $task = model.at(`tasksRead.${taskId}`)

    try {
      await $task.subscribe()
      assert(false)
    } catch (e) {
      $task.unsubscribe()
      assert.strictEqual(e.code, 'ERR_ACCESS_DENY_READ')
    }
  })
})
