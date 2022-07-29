const assert = require('assert')
const { getDbs } = require('./db.js')
const ShareDbAccess = require('../lib/index.js')
const { backend } = getDbs()
const model = backend.createModel()
const shareDBAccess = new ShareDbAccess(backend)

// for check request from server
model.root.connection.agent.stream.checkServerAccess = true

describe('DELETE', function () {
  before(async () => {
    backend.allowCreate('tasksDelete', async (docId, doc, session) => {
      return true
    })
    backend.allowRead('tasksDelete', async (docId, doc, session) => {
      return true
    })
  })

  beforeEach(async () => {
    shareDBAccess.allow.Delete.tasksDelete = []
    shareDBAccess.deny.Delete.tasksDelete = []
  })

  it('deny = false && allow = false', async () => {
    backend.denyDelete('tasksDelete', async (docId, doc, session) => {
      return false
    })
    backend.allowDelete('tasksDelete', async (docId, doc, session) => {
      return false
    })

    const taskId = await model.add('tasksDelete', {})
    const $task = model.at(`tasksDelete.${taskId}`)

    try {
      await $task.subscribe()
      await $task.del()
      assert(false)
    } catch (e) {
      $task.unsubscribe()
      assert.strictEqual(e.code, 'ERR_ACCESS_DENY_DELETE')
    }
  })

  it('deny = false && allow = true', async () => {
    backend.denyDelete('tasksDelete', async (docId, doc, session) => {
      return false
    })
    backend.allowDelete('tasksDelete', async (docId, doc, session) => {
      return true
    })

    try {
      const taskId = await model.add('tasksDelete', {})
      const $task = model.at(`tasksDelete.${taskId}`)
      await $task.subscribe()
      await $task.del()
      $task.unsubscribe()
      assert(true)
    } catch (e) {
      assert(false)
    }
  })

  it('deny = true && allow = false', async () => {
    backend.denyDelete('tasksCreate', async (docId, doc, session) => {
      return true
    })
    backend.allowDelete('tasksCreate', async (docId, doc, session) => {
      return false
    })

    const taskId = await model.add('tasksDelete', {})
    const $task = model.at(`tasksDelete.${taskId}`)

    try {
      await $task.subscribe()
      await $task.del()
      assert(false)
    } catch (e) {
      $task.unsubscribe()
      assert.strictEqual(e.code, 'ERR_ACCESS_DENY_DELETE')
    }
  })

  it('deny = true && allow = true', async () => {
    backend.denyDelete('tasksCreate', async (docId, doc, session) => {
      return true
    })
    backend.allowDelete('tasksCreate', async (docId, doc, session) => {
      return true
    })

    const taskId = await model.add('tasksDelete', {})
    const $task = model.at(`tasksDelete.${taskId}`)

    try {
      await $task.subscribe()
      await $task.del()
      $task.unsubscribe()
      assert(false)
    } catch (e) {
      assert.strictEqual(e.code, 'ERR_ACCESS_DENY_DELETE')
    }
  })
})
