const assert = require('assert')
const { getDbs } = require('./db.js')
const ShareDbAccess = require('../lib/index.js')

let { backend } = getDbs()
const model = backend.createModel()

// for check request from server
model.root.connection.agent.stream.checkServerAccess = true

let taskId

let shareDBAccess = new ShareDbAccess(backend)

const $session = model.scope('_session')
const errorTemplate = 'Permission denied (delete)'

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
    taskId = model.id()
    await model.add('tasksDelete', { id: taskId, type: 'testDelete' })
  })

  afterEach(function () {
    shareDBAccess.allow.Delete.tasksDelete = []
    shareDBAccess.deny.Delete.tasksDelete = []
  })

  it('deny = false && allow = false => err{ code: 403 }', async () => {
    backend.denyDelete('tasksDelete', async (docId, doc, session) => {
      return false
    })
    backend.allowDelete('tasksDelete', async (docId, doc, session) => {
      return false
    })

    try {
      const $task = model.at('tasksDelete' + '.' + taskId)
      await $task.subscribe()
      await $task.del()

      const accessError = $session.get('_accessError')

      assert.strictEqual(accessError.message.includes(errorTemplate), true)
      assert.strictEqual(accessError.code, 403)
    } catch (e) {
      assert(false)
    }
  })

  it('deny = false && allow = true => not err', async () => {
    backend.denyDelete('tasksDelete', async (docId, doc, session) => {
      return false
    })
    backend.allowDelete('tasksDelete', async (docId, doc, session) => {
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

  it('deny = true && allow = false => err{ code: 403 }', async () => {
    backend.denyCreate('tasksCreate', async (docId, doc, session) => {
      return true
    })
    backend.allowCreate('tasksCreate', async (docId, doc, session) => {
      return false
    })

    try {
      const $task = model.at('tasksDelete' + '.' + taskId)
      await $task.subscribe()
      await $task.del()

      const accessError = $session.get('_accessError')

      assert.strictEqual(accessError.message.includes(errorTemplate), true)
      assert.strictEqual(accessError.code, 403)
    } catch (e) {
      assert(false)
    }
  })

  it('deny = true && allow = true => err{ code: 403 }', async () => {
    backend.denyCreate('tasksCreate', async (docId, doc, session) => {
      return true
    })
    backend.allowCreate('tasksCreate', async (docId, doc, session) => {
      return true
    })

    try {
      const $task = model.at('tasksDelete' + '.' + taskId)
      await $task.subscribe()
      await $task.del()

      const accessError = $session.get('_accessError')

      assert.strictEqual(accessError.message.includes(errorTemplate), true)
      assert.strictEqual(accessError.code, 403)
    } catch (e) {
      assert(false)
    }
  })
})
