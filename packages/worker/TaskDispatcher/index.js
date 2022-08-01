import random from 'lodash/random.js'
import AutoStop from './utils/autoStop.js'
import { delay } from '../utils.js'
import MongoQueue from './MongoQueue.js'
import RedisQueue from './RedisQueue.js'
import WorkerManager from '../WorkerManager/index.js'
import './utils/defaults.js'
// order of import getDbs is important since /utils/defaults configures env vars
import { getDbs } from '../db.js'

const env = process.env

export default class TaskDispatcher {
  constructor (num) {
    this.num = num
    this.started = false

    AutoStop.once('exit', async () => {
      await this.stop()
    })
  }

  async init () {
    // TODO
    // Do we need to pass options to getDbs?
    this.dbs = await getDbs({ secure: false })
    this.mongoQueue = new MongoQueue(this.dbs, this.num)
    this.redisQueue = new RedisQueue(this.dbs, this.executeTask.bind(this), this.num)
  }

  async start () {
    if (this.started) return
    await this.init()
    this.workerManager = new WorkerManager(this.num, this.options)
    await this.workerManager.start()
    this.started = true
    this._startLoops()
  }

  async stop () {
    if (!this.started) return
    await this.workerManager.stop()
    this.workerManager = null
    this.started = false
  }

  async executeTask (taskId, status = 'executing', statusError) {
    const { backend } = this.dbs
    const model = backend.createModel()
    const collection = env.WORKER_TASK_COLLECTION
    const $task = model.at(collection + '.' + taskId)
    let workerId

    await model.fetchAsync($task)

    if (!$task.get()) {
      model.close()
      return console.log('ERROR: cant get task', taskId)
    }

    const { uniqId, type, createdAt } = $task.get()
    let start
    let duration
    let waiting

    switch (status) {
      case ('executing'):
        start = Date.now()
        await model.setEachAsync($task.path(), {
          status: 'executing',
          executingTime: Date.now()
        })

        try {
          workerId = await this.workerManager.executeTask(taskId)
          await model.setEachAsync($task.path(), {
            status: 'done',
            doneTime: Date.now()
          })
        } catch (err) {
          console.log(`Task error - tId: ${taskId}, uId: ${uniqId}, type: ${type}, error: '${err}'`)

          await model.setEachAsync($task.path(), {
            status: 'error',
            error: err,
            errorTime: Date.now()
          })
        }

        duration = Date.now() - start
        waiting = start - createdAt
        console.log(`Task executed - tId: ${taskId}, uId: ${uniqId}, type: ${type}, wId: ${workerId} (${waiting}, ${duration})`)

        break
      case ('refused'):
        console.log(`Task refused - tId: ${taskId}, uId: ${uniqId}, type: ${type}`)
        $task.setEach({
          status: 'refused',
          error: statusError,
          refusedTime: Date.now()
        })
        break
      default:
        console.log('Unknown status', taskId, status)
    }

    model.close()
  }

  _startLoops () {
    this._mongoLoop().catch((err) => {
      console.log('Something wrong in mongo loop', err)
    })
    this._redisLoop().catch((err) => {
      console.log('Something wrong in redis loop', err)
    })
  }

  async _mongoLoop () {
    const timeout = Number(env.WORKER_MONGO_QUERY_INTERVAL)
    await delay(0)
    while (this.started) {
      await this.mongoQueue.doLoop()
      const time = random(timeout - 50, timeout + 50)
      await delay(time)
    }
  }

  async _redisLoop () {
    const timeout = Number(env.WORKER_REDIS_QUEUE_INTERVAL)
    await delay(0)
    while (this.started) {
      await this.redisQueue.doLoop()
      const time = random(timeout - 50, timeout + 50)
      await delay(time)
    }
  }
}
