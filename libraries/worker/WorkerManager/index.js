import without from 'lodash/without.js'
import { delay } from '../utils.js'
import Worker from '../Worker/index.js'

const env = process.env

export default class WorkerManager {
  // TODO
  // we should refactor code to use one 'num' param everywhere
  // problem is:
  // class accepts 'num' param in constructor
  // this param is the same as env.WORKER_CHILDREN_NUM
  constructor () {
    this.children = []
    this.started = false
  }

  async start () {
    if (this.started) return
    if (this.starting) return

    this.starting = true

    this.started = true
    for (let i = 0; i < env.WORKER_CHILDREN_NUM; i++) {
      let child = await this._spawnChild()
      if (child) {
        this.children.push(child)
      }
    }
    this.starting = false
  }

  async _spawnChild () {
    if (!this.started) return
    let child = new Worker()
    await child.start(this.num)

    child.on('end', async (reason) => {
      await this._childIdDead(child, reason)
    })

    if (!this.started) {
      // in case of race condition
      await child.stop()
      return
    }

    return child
  }

  async _childIdDead (child, reason) {
    const num = env.WORKER_CHILDREN_NUM
    this.children = without(this.children, child)

    if (this.stopping) return
    if (!this.started) return

    if (this.children.length >= num) return

    console.log('recreating', reason)
    let newAmount = num - this.children.length

    for (let i = 0; i < newAmount; i++) {
      let child = await this._spawnChild()
      if (child) {
        this.children.push(child)
      }
    }
  }

  async stop () {
    if (this.stopping) return

    this.stopping = true

    // todo fix this
    while (this.children.length > 0) {
      await this.children[0].stop()
      await delay(100)
    }

    this.started = false
    this.stopping = false
  }

  async executeTask (taskId, params) {
    let child = this.children[0]
    while (!child || !child.ready) {
      await delay(100)
      child = this.children[0]
    }
    return await child.executeTask(taskId, params)
  }
}
