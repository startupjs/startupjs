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
const checkPromise = () => {
  return new Promise((resolve, reject) => {
    model.on('error', (error) => {
      resolve(error)
    })
    id = model.id()
    model.add('tasksCreate', { id, type: 'testCreate' })

    setTimeout(() => resolve(true), 1000)
  })
}

describe('CREATE', function () {
  afterEach(function () {
    shareDBAccess.allow.Create.tasksCreate = []
    shareDBAccess.deny.Create.tasksCreate = []
  })

  it.only('deny = false && allow = false => err{ code: 403.1 }', async () => {
    backend.denyCreate('tasksCreate', async (docId, doc, session) => {
      return false
    })
    backend.allowCreate('tasksCreate', async (docId, doc, session) => {
      return false
    })

    const res = await checkPromise()
    assert.strictEqual(res.code, 403.1)
  })

  it('deny = false && allow = true => not err', async () => {
    backend.denyCreate('tasksCreate', async (docId, doc, session) => {
      return false
    })
    backend.allowCreate('tasksCreate', async (docId, doc, session) => {
      return true
    })

    const res = await checkPromise()
    assert.strictEqual(res, true)
  })

  it('deny = true && allow = false => err{ code: 403.1 }', async () => {
    backend.denyCreate('tasksCreate', async (docId, doc, session) => {
      return true
    })
    backend.allowCreate('tasksCreate', async (docId, doc, session) => {
      return false
    })

    const res = await checkPromise()
    assert.strictEqual(res.code, 403.1)
  })

  it('deny = true && allow = true => err{ code: 403.1 }', async () => {
    backend.denyCreate('tasksCreate', async (docId, doc, session) => {
      return true
    })
    backend.allowCreate('tasksCreate', async (docId, doc, session) => {
      return true
    })

    const res = await checkPromise()
    assert.strictEqual(res.code, 403.1)
  })
})
