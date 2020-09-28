const assert = require('assert')
const path = require('path')
const { getDbs } = require('./db.js')
const shareDbAccess = require('../lib/index.js')

let { backend } = getDbs()
const model = backend.createModel()

// for check request from server
model.root.connection.agent.stream.checkServerAccess = true

let shareDBAccess = new shareDbAccess(backend)
let id


// we have to use promise for test becouse error appears in eventHendler in shareDb lib and we can't catch it with standart try...catch
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

  it('deny = false && allow = false => err{ code: 403.1 }', async () => {
    backend.denyCreate('tasksCreate', async (docId, doc, session) => {
      return false
    })
    backend.allowCreate('tasksCreate', async (docId, doc, session) => {
      return false
    })

    const res = await checkPromise()
    assert.equal(res.code, 403.1)    
  })

  it('deny = false && allow = true => not err', async () => {
    backend.denyCreate('tasksCreate', async (docId, doc, session) => {
      return false
    })
    backend.allowCreate('tasksCreate', async (docId, doc, session) => {
      return true
    })

    const res = await checkPromise()
    assert.equal(res, true)
  })

  it('deny = true && allow = false => err{ code: 403.1 }', async () => {
    backend.denyCreate('tasksCreate', async (docId, doc, session) => {
      return true
    })
    backend.allowCreate('tasksCreate', async (docId, doc, session) => {
      return false
    })

    const res = await checkPromise()
    assert.equal(res.code, 403.1)
  })

  it('deny = true && allow = true => err{ code: 403.1 }', async () => {
    backend.denyCreate('tasksCreate', async (docId, doc, session) => {
      return true
    })
    backend.allowCreate('tasksCreate', async (docId, doc, session) => {
      return true
    })
    
    const res = await checkPromise()
    assert.equal(res.code, 403.1)
  })
})
