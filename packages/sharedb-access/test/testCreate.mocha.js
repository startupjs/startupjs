const assert = require('assert')
const { getDbs } = require('./db.js')
const ShareDbAccess = require('../lib/index.js')

let { backend } = getDbs()
const model = backend.createModel()

// for check request from server
model.root.connection.agent.stream.checkServerAccess = true

let shareDBAccess = new ShareDbAccess(backend)
let id

const $session = model.scope('_session')
const errorTemplate = 'Permission denied (create)'

describe('CREATE', function () {
  afterEach(function () {
    shareDBAccess.allow.Create.tasksCreate = []
    shareDBAccess.deny.Create.tasksCreate = []
  })

  it('deny = false && allow = false => err{ code: 403 }', async () => {
    backend.denyCreate('tasksCreate', async (docId, doc, session) => {
      return false
    })
    backend.allowCreate('tasksCreate', async (docId, doc, session) => {
      return false
    })
    try {
      id = model.id()
      await model.add('tasksCreate', { id, type: 'testCreate' })

      const accessError = $session.get('_accessError')

      assert.strictEqual(accessError.message.includes(errorTemplate), true)
      assert.strictEqual(accessError.code, 403)
    } catch (e) {
      assert(false)
    }
  })

  it('deny = false && allow = true => not err', async () => {
    backend.denyCreate('tasksCreate', async (docId, doc, session) => {
      return false
    })
    backend.allowCreate('tasksCreate', async (docId, doc, session) => {
      return true
    })

    try {
      id = model.id()
      await model.add('tasksCreate', { id, type: 'testCreate' })
    } catch (e) {
      assert(false)
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
      id = model.id()
      await model.add('tasksCreate', { id, type: 'testCreate' })

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
      id = model.id()
      await model.add('tasksCreate', { id, type: 'testCreate' })

      const accessError = $session.get('_accessError')

      assert.strictEqual(accessError.message.includes(errorTemplate), true)
      assert.strictEqual(accessError.code, 403)
    } catch (e) {
      assert(false)
    }
  })
})
