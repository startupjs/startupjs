const assert = require('assert')
const { getDbs } = require('./db.js')
const ShareDbAccess = require('../lib/index.js')
const { backend } = getDbs()
const model = backend.createModel()
const shareDBAccess = new ShareDbAccess(backend)

// for check request from server
model.root.connection.agent.stream.checkServerAccess = true

describe('CREATE', function () {
  before(async () => {
    // the read operation is triggered if create operation throw an error
    // the read operation is not triggered if create opeartion does not throw an error
    // this allowRead removes read error from error log when create operation throw an error
    backend.allowRead('tasksCreate', async (docId, doc, session) => {
      return true
    })
  })

  beforeEach(function () {
    shareDBAccess.allow.Create.tasksCreate = []
    shareDBAccess.deny.Create.tasksCreate = []
  })

  it('deny = false && allow = false', async () => {
    backend.denyCreate('tasksCreate', async (docId, doc, session) => {
      return false
    })
    backend.allowCreate('tasksCreate', async (docId, doc, session) => {
      return false
    })
    try {
      await model.add('tasksCreate', {})
      assert(false)
    } catch (e) {
      assert.strictEqual(e.code, 'ERR_ACCESS_DENY_CREATE')
    }
  })

  it('deny = false && allow = true', async () => {
    backend.denyCreate('tasksCreate', async (docId, doc, session) => {
      return false
    })
    backend.allowCreate('tasksCreate', async (docId, doc, session) => {
      return true
    })

    try {
      await model.add('tasksCreate', {})
      assert(true)
    } catch (e) {
      assert(false)
    }
  })

  it('deny = true && allow = false', async () => {
    backend.denyCreate('tasksCreate', async (docId, doc, session) => {
      return true
    })
    backend.allowCreate('tasksCreate', async (docId, doc, session) => {
      return false
    })

    try {
      await model.add('tasksCreate', {})
      assert(false)
    } catch (e) {
      assert.strictEqual(e.code, 'ERR_ACCESS_DENY_CREATE')
    }
  })

  it('deny = true && allow = true', async () => {
    backend.denyCreate('tasksCreate', async (docId, doc, session) => {
      return true
    })
    backend.allowCreate('tasksCreate', async (docId, doc, session) => {
      return true
    })

    try {
      await model.add('tasksCreate', {})
      assert(false)
    } catch (e) {
      assert.strictEqual(e.code, 'ERR_ACCESS_DENY_CREATE')
    }
  })
})
