import { strict as assert } from 'assert'
import { getDbs } from './db.js'
import chai from 'chai'
import shareDbAccess from '../lib/index.js'

const { expect } = chai

let { backend } = getDbs()
const model = backend.createModel()

// for check request from server
model.root.connection.agent.stream.checkServerAccess = true

let shareDBAccess = new shareDbAccess(backend)

let taskId

// we have to use promise for test becouse error appears in eventHendler in shareDb lib and we can't catch it with standart try...catch
const checkPromise = () => {
  return new Promise((resolve, reject) => {
    model.on('error', (error) => {
      resolve(error)
    })
    const $task = model.at('tasksRead' + '.' + taskId)
    $task.subscribe()
    $task.unsubscribe()
    setTimeout(() => resolve(true), 1000)
  })
}

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

  it('deny = false && allow = false => err{ code: 403.2 }', async () => {
    backend.denyRead('tasksRead', async (docId, doc, session) => {
      return false
    })
    backend.allowRead('tasksRead', async (docId, doc, session) => {
      return false
    })
    
    const res = await checkPromise()
    assert.equal(res.code, 403.2)
    
  })

  it('deny = false && allow = true => not err', async () => {
    backend.denyRead('tasksRead', async (docId, doc, session) => {
      return false
    })
    backend.allowRead('tasksRead', async (docId, doc, session) => {
      return true
    })
    
    const res = await checkPromise()
    assert.equal(res, true)
  })

  it('deny = true && allow = false => err{ code: 403.2 }', async () => {
    backend.denyRead('tasksRead', async (docId, doc, session) => {
      return true
    })
    backend.allowRead('tasksRead', async (docId, doc, session) => {
      return false
    })

    const res = await checkPromise()
    assert.equal(res.code, 403.2)
  })

  it('deny = true && allow = true => err{ code: 403.2 }', async () => {
    backend.denyRead('tasksRead', async (docId, doc, session) => {
      return true
    })
    backend.allowRead('tasksRead', async (docId, doc, session) => {
      return true
    })
    const res = await checkPromise()
    assert.equal(res.code, 403.2)
  })
})