import cluster from 'cluster'
import { isPromise } from '../utils.js'
import { getDbs } from './../db.js'

const env = process.env
const collection = env.WORKER_TASK_COLLECTION
let dbs
let actions
let customInit

;(async () => {
  dbs = await getDbs({ secure: false })

  try {
    await import(env.WORKER_ACTIONS_PATH)
    actions = global.DM_WORKER_ACTIONS || {}
  } catch (e) {
    console.warn('[worker] WARNING! No actions file found. Create a workerActions.js file in ' +
        'your project\'s worker directory with the actions which the worker can execute.')
  }

  try {
    await import(env.WORKER_INIT_PATH) // This should populate the global DM_WORKER_ACTIONS var
    customInit = global.DM_WORKER_INIT
    if (typeof customInit === 'function') {
      customInit(dbs.backend)
    } else {
      console.warn('[worker] WARNING! workerInit.js doesn\'t export a function. Ignoring.')
    }
  } catch (e) {
    console.log(e, 'error')
    console.warn('[worker] WARNING! No custom init file found. Create an workerInit.js file in ' +
        'your project\'s worker directory to do the custom initialization of backend (hooks, etc.).')
  }

  process.on('message', (data) => {
    let taskId = data && data.taskId

    if (!taskId) {
      console.log('[Child Worker] received unknown message format', data)
      return
    }

    executeTaskWrapper(data.taskId).then(() => {
      process.send({ taskId })
    }).catch((err) => {
      console.log('Done task - err', taskId, cluster.worker.id, err)
      process.send({ taskId, err: err && err.message })
    })
  })

  process.send({ ready: true })
})()

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

  model.close()
}
