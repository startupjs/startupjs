import { strict as assert } from 'assert'
import { getDbs } from './db.js'
import chai from 'chai'
import shareDbAccess from '../lib/index.js'

let { backend } = getDbs()
const model = backend.createModel()

// for check request from server
model.root.connection.agent.stream.checkServerAccess = true

let shareDBAccess = new shareDbAccess(backend)

let id

// we have to use promise for test becouse error appears in eventHendler in shareDb lib and we can't catch it with standart try...catch
const checkPromise = (number) => {
  return new Promise((resolve, reject) => {
    model.on('error', (error) => {
      resolve(error)
    })
    const $task = model.at('tasksUpdate' + '.' + id)
    $task.set('newField' + number, 'testInfo')
    setTimeout(() => resolve(true), 1000)
  })
}

describe('UPDATE', function () {

  before(async () => {
    backend.allowCreate('tasksUpdate', async (docId, doc, session) => {
      return true
    })
    backend.allowRead('tasksUpdate', async (docId, doc, session) => {
      return true
    })

    id = model.id()
    await model.add('tasksUpdate', { id, type: 'testUpdate' })
  })

  afterEach(function () {
    shareDBAccess.allow.Update.tasksUpdate = []
    shareDBAccess.deny.Update.tasksUpdate = []
  })

  it('deny = false && allow = false => err{ code: 403.3 }', async () => {
    backend.denyUpdate('tasksUpdate', async (docId, oldDoc, newDoc, ops, session) => {
      return false
    })
    backend.allowUpdate('tasksUpdate', async (docId, oldDoc, newDoc, ops, session) => {
      return false
    })
    
    const res = await checkPromise(1)
    assert.equal(res.code, 403.3)
  })

  it('deny = false && allow = true => not err', async () => {
    backend.denyUpdate('tasksUpdate', async (docId, oldDoc, newDoc, ops, session) => {
      return false
    })
    backend.allowUpdate('tasksUpdate', async (docId, oldDoc, newDoc, ops, session) => {
      return true
    })
      
    const res = await checkPromise(2)
    assert.equal(res, true)
   
  })

  it('deny = true && allow = false => err{ code: 403.3 }', async () => {
    backend.denyUpdate('tasksUpdate', async (docId, oldDoc, newDoc, ops, session) => {
      return true
    })
    backend.allowUpdate('tasksUpdate', async (docId, oldDoc, newDoc, ops, session) => {
      return false
    })
    
    const res = await checkPromise(3)
    assert.equal(res.code, 403.3)
  })

  it('deny = true && allow = true => err{ code: 403.3 }', async () => {
    backend.denyUpdate('tasksUpdate', async (docId, oldDoc, newDoc, ops, session) => {
      return true
    })
    backend.allowUpdate('tasksUpdate', async (docId, oldDoc, newDoc, ops, session) => {
      return true
    })
    
    const res = await checkPromise(4)
    assert.equal(res.code, 403.3)
  })

})
