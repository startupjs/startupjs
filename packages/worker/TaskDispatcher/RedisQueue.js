import { delay } from '../utils.js'

const env = process.env

export default class RedisQueue {
  constructor (dbs, runTask, dispatcherNum) {
    this.dispatcherNum = dispatcherNum
    this.backend = dbs.backend
    this.redlock = dbs.redlock
    this.redis = dbs.redisClient
    this.runTask = runTask
  }

  async getTaskList () {
    try {
      const tasks = JSON.parse(await this.redis.get('tasks:list'))
      return tasks
    } catch (err) {
      return []
    }
  }

  async doLoop () {
    const tasks = await this.getTaskList() || []
    await this.handleTasks(tasks)
  }

  async handleTask (task) {
    const taskId = task._id
    const { options = {} } = task
    const locks = {}
    let runFlag

    const taskLockHandler = async () => {
      await delay(0)
      const taskLockKey = 'tasks:regular:' + taskId
      try {
        const timeout = Number(env.WORKER_TASK_DEFAULT_TIMEOUT) + Number(env.WORKER_MONGO_QUERY_TIMEOUT)
        locks.taskLock = await this.redlock.lock(taskLockKey, timeout)
      } catch (err) {
        throw new Error('task skip')
      }
    }

    const singletonLockHandler = async () => {
      if (!options.singleton) return
      await delay(0)
      const timeout = Number(env.WORKER_TASK_DEFAULT_TIMEOUT)
      const taskSingletonLockKey = 'tasks:singleton:' + task.uniqId
      try {
        locks.singletonLock = await this.redlock.lock(taskSingletonLockKey, timeout)
      } catch (err) {
        throw new Error('singleton skip')
      }
    }

    const throttleLockHandler = async () => {
      if (!options.throttle) return
      await delay(0)
      const timeout = options.throttleTimeout || Number(env.WORKER_THROTTLE_TIMEOUT)
      const taskThrottleLockKey = 'tasks:throttle:' + task.uniqId
      try {
        locks.throttleLock = await this.redlock.lock(taskThrottleLockKey, timeout)
      } catch (err) {
        // Simple throttle - drop everything if locked
        if (!options.trailing) throw new Error('refused')

        // Trailing throttle - if the task is not the
        // last one just - drop it
        if (task.num !== 1) throw new Error('refused')
      }
    }

    try {
      // The order is VERY important
      await taskLockHandler()
      await throttleLockHandler()
      await singletonLockHandler()

      runFlag = true

      await this.runTask(taskId, 'executing')
    } catch (err) {
      const message = err.message

      if (message === 'refused') {
        runFlag = true
        await this.runTask(taskId, 'refused', 'Throttle')
      }
      // skip the task
    }

    if (locks.taskLock) {
      let timeout = Number(env.WORKER_MONGO_QUERY_TIMEOUT) + 100
      if (!runFlag) timeout = 0

      setTimeout(() => {
        locks.taskLock.unlock(function (err) {
          if (err) console.log('Error while unlocking task lock', err)
        })
      }, timeout)
    }

    if (locks.singletonLock) {
      locks.singletonLock.unlock(function (err) {
        if (err) console.log('Error while unlocking singleton lock', err)
      })
    }
  }

  async handleTasks (tasks) {
    let label = env.WORKER_TASK_LABEL

    if (label) {
      const labels = label.split(',')
      tasks = tasks.filter(task => labels.includes(task.label))
    } else {
      tasks = tasks.sort((t1, t2) => {
        if (t1.label) return 1
        if (t2.label) return -1
        return 0
      })
    }

    for (let task of tasks) {
      await this.handleTask(task)
      await delay(0)
    }
  }
}
