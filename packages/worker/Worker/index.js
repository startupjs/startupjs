import { EventEmitter } from 'events'
import random from 'lodash/random.js'
import cluster from 'cluster'
import entryPath from './entryPath.cjs'

const env = process.env

cluster.setupMaster({ exec: entryPath })

export default class Worker extends EventEmitter {
  constructor () {
    super()

    this.startTime = Date.now()
    this.tasks = 0
    this.tasksLimit = random(200, 500)
  }

  async start () {
    this.worker = await this.createWorker()
  }

  createWorker () {
    return new Promise((resolve, reject) => {
      let worker = cluster.fork(process.env)

      worker.once('message', (data) => {
        if (data.ready) {
          // child process spawned, connected and initialized
          // we don't use 'online' event, case our initialization takes
          // about 2 sec, so we want to be sure we can work with
          // child process immediately
          this.ready = true
          console.log('Child Worker is ready', (Date.now() - this.startTime), ', id:', worker.id)
          resolve(worker)
          // this.emit('ready')
        }
      })

      let exit = (reason) => {
        if (this.exitedOnce) return
        console.log('Child Worker is ending, id:', worker.id)
        if (this.taskReject) this.taskReject('Child worker is dead during the execution, taskId: ' + this.taskId)
        this.ready = false
        this.exitedOnce = true
        this.emit('end', reason)
      }

      worker.on('disconnect', exit.bind(this, 'disconnect'))
      worker.on('exit', exit.bind(this, 'exit'))
      worker.on('error', exit.bind(this, 'error'))
    })
  }

  async stop () {
    if (!this.ready) return
    this.ready = false

    if (this.worker) {
      try {
        // if (this.worker.connected) {
        this.worker.kill()
        // }
      } catch (e) {}
      this.worker = null
    }
  }

executeTask (taskId, { timeout = env.WORKER_TASK_DEFAULT_TIMEOUT } = {}) {
    this.taskId = taskId
    return new Promise((resolve, reject) => {
      if (!this.ready) return reject(new Error('Worker is dead: taskId: ' + taskId))
      this.taskReject = reject
      let timer = setTimeout(() => {
        reject(new Error('Task timeout reached: ' + taskId))

        if (this.ready) this.worker.kill()
      }, Number(timeout))

      this.worker.once('message', (data) => {
        let taskId = data && data.taskId
        let err = data && data.err

        if (!taskId) {
          return reject(new Error('Child Worker returned message in unknown format: ' + data))
        }
        if (taskId !== this.taskId) {
          return reject(new Error('Child Worker returned message for another task: ' + taskId + ' ' + this.taskId))
        }
        if (err) {
          return reject(err)
        }

        this.taskId = null
        this.taskReject = null
        clearTimeout(timer)
        resolve(this.worker.id)
        this.handleTaskLimit()
      })

      return this.worker.send({ taskId })
    })
  }

  handleTaskLimit () {
    this.tasks += 1
    if (this.tasks <= this.tasksLimit) return

    console.log('Child Worker tasks limit is reached. Respawn')
    this.stop().catch((err) => {
      console.log('Error while stopping a worker:', err)
    })
  }
}
