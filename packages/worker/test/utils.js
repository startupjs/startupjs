import isPlainObject from 'lodash/isPlainObject.js'
import { delay } from '../utils.js'
import TaskDispatcher from '../TaskDispatcher/index.js'
// order of import getDbs is important since TaskDispatcher configures env vars
import { getDbs } from './../db.js'

export default class DispatcherRunner {
  async init () {
    if (this.dbs) return
    this.dbs = await getDbs({ secure: false })
  }

  async start (num) {
    this.runners = []
    for (let i = 0; i < num; i++) {
      const runner = new TaskDispatcher(i)
      await runner.start()
      this.runners.push(runner)
      runner._num = i
      console.log('Dispatcher', i, 'is started')
    }
    const { backend } = this.dbs
    // pass 'fetchOnly: false' because of @startupjs/backend that
    // patches racer's model creation with 'fetchOnly: true'
    this.model = backend.createModel({ fetchOnly: false })
  }

  async stop () {
    for (let runner of this.runners) {
      await runner.stop()
      console.log('Dispatcher', runner._num, 'is stopped')
    }
    this.model.close()
    delete this.model
  }

  async createTask (uniqId, options) {
    if (isPlainObject(uniqId)) {
      options = uniqId
      uniqId = this.model.id()
    }

    const now = Date.now()
    const id = this.model.id()

    const task = {
      id,
      createdAt: now,
      type: options._type || 'test',
      status: 'new',
      uniqId,
      options
    }

    await this.model.addAsync('tasks', task)
    return id
  }

  async executeTasks (params = {}, num, delayTime, options) {
    const model = this.model
    const result = {
      done: 0,
      refused: 0,
      error: 0,
      time: 0,
      series: true,
      maxParallel: 0
    }

    const start = Date.now()
    // let finishedCounter = 0
    let runningCounter = 0
    const id = model.id()

    const runTask = (taskId) => {
      return new Promise((resolve, reject) => {
        const $task = model.scope('tasks.' + taskId)

        const finish = () => {
          result.timestamps = result.timestamps || []
          result.timestamps.push($task.get('createdAt'))

          model.unsubscribe($task, (err) => {
            if (err) return reject(err)
            result.timestamps = result.timestamps || []
            result.timestamps.push()
            resolve()
          })
        }

        model.subscribe($task, (err) => {
          if (err) return reject(err)
          $task.on('change', 'status', (status) => {
            switch (status) {
              case 'executing':
                runningCounter++
                if (runningCounter > 1) {
                  result.series = false
                }
                result.maxParallel = Math.max(runningCounter, result.maxParallel)
                break
              case 'done':
              case 'error':
              case 'refused':
                runningCounter--
                result[status]++
                // finishedCounter++
                finish()
            }
          })
        })
      })
    }

    const tasks = []
    for (let i = 0; i < num; i++) {
      let uniqId = id
      if (params.differentUniqIds) uniqId = model.id()
      tasks.push(runTask(await this.createTask(uniqId, options)))
      await delay(delayTime)
    }

    await Promise.all(tasks)
    result.time = Date.now() - start

    return result
  }

  dropMongoDatabase () {
    return new Promise((resolve, reject) => {
      const { shareMongo } = this.dbs
      shareMongo.getDbs((_err, mongo) => {
        mongo.dropDatabase((err) => {
          // eslint-disable-next-line prefer-promise-reject-errors
          if (err) return reject()
          console.log('Drop mongo db')
          resolve()
        })
      })
    })
  }

  dropRedisDatabase () {
    return new Promise((resolve, reject) => {
      const { redisClient } = this.dbs
      redisClient.flushdb((err) => {
        // eslint-disable-next-line prefer-promise-reject-errors
        if (err) return reject()
        console.log('Drop redis db')
        resolve()
      })
    })
  }
}
