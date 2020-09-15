import { getDbs } from '../db.js'
import cluster from 'cluster'
import { isPromise } from '../utils.js'

const worker = cluster.worker
const env = process.env
const collection = env.WORKER_TASK_COLLECTION
const ACTIONS_PATH = env.WORKER_ACTIONS_PATH
const INIT_PATH = env.WORKER_INIT_PATH

let actions;
(async () => {
  try {
    let actionsFilePath = ACTIONS_PATH
    let importedActions
    importedActions = await import(actionsFilePath)
    actions = importedActions.ACTIONS || {}
  } catch (e) {
    console.warn('[worker] WARNING! No actions file found. Create a workerActions.js file in ' +
        'your project\'s worker directory with the actions which the worker can execute.')
  }
})()

let customInit;
// Execute worker init file from the parent project's root/worker folder (if exists)
(async () => {
  try {
    let initFilePath = INIT_PATH
    let importedCustomInit
    importedCustomInit = await import(initFilePath) // This should populate the global DM_WORKER_ACTIONS var
    customInit = importedCustomInit.init
    if (typeof customInit !== 'function') {
      console.warn('[worker] WARNING! initWorker.js doesn\'t export a function. Ignoring.')
    }
  } catch (e) {
    console.warn('[worker] WARNING! No custom init file found. Create an initWorker.js file in ' +
        'your project\'s worker directory to do the custom initialization of backend (hooks, etc.).')
  }
})()

const dbs = getDbs()
customInit && customInit(dbs.backend)

function executeTask (action, model, task, done) {
  const res = action(model, task, done)
  if (isPromise(res)) {
    res.then((result) => {
      done(null, result)
    }).catch((error) => {
      done(error)
    })
  }
}

async function executeTaskWrapper (taskId) {
  // console.log('run task', taskId)
  const { backend } = dbs
  const model = backend.createModel()
  const $task = model.at(collection + '.' + taskId)
  await model.fetchAsync($task)
  const task = $task.get()

  if (!task) {
    model.close()
    throw new Error('No task with such taskId: ' + taskId)
  }

  if (task.status !== 'executing') {
    model.close()
    throw new Error(`Task status is not executing: ${task.status}, tId: ${taskId}`)
  }

  let actionType = task.type
  if (!actionType) {
    model.close()
    throw new Error(`No action type in task, tId: ${taskId}`)
  }

  let action = actions[actionType]

  if (!action) {
    model.close()
    throw new Error(`No action to execute: ${action}, tId: ${taskId}`)
  }

  await new Promise((resolve, reject) => {
    executeTask(action, model, task, (err) => {
      if (err) return reject(err)
      return resolve()
    })
  })
  await model.unfetchAsync($task)
  model.close()
}

process.on('message', (data) => {
  let taskId = data && data.taskId

  if (!taskId) {
    console.log('[Child Worker] received unknown message format', data)
    return
  }

  // console.log('Run task', taskId, worker.id)

  executeTaskWrapper(data.taskId).then(() => {
    // console.log('Done task', taskId, worker.id)
    process.send({ taskId })
  }).catch((err) => {
    console.log('Done task - err', taskId, worker.id, err)
    process.send({ taskId, err: err && err.message })
  })
})

process.send({ ready: true })
