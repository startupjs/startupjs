import { strict as assert } from 'assert'
import sortBy from 'lodash/sortBy.js'
import clone from 'lodash/clone.js'
import path from 'path'
import DispatcherRunner from './utils.js'
import { __dirname } from './__dirname.js'

describe('tasks', function () {
  const runner = new DispatcherRunner()
  this.timeout(40000)

  before(async () => {
    process.env.WORKER_TASK_DEFAULT_TIMEOUT = '30000' // default
    process.env.WORKER_ACTIONS_PATH = path.join(__dirname, './workerActions.js')
    process.env.WORKER_INIT_PATH = path.join(__dirname, './workerInit.js')
    await runner.init()
    await runner.dropMongoDatabase()
    await runner.dropRedisDatabase()
    await runner.start(3)
  })

  after(async () => {
    await runner.stop()
  })

  describe('simple case', () => {
    it('fast tasks - regular mode', async () => {
      const taskNum = 10
      const result = await runner.executeTasks({ differentUniqIds: true }, taskNum, 0, { duration: 50 })
      assert.equal(taskNum, result.done)
      assert(!result.series)
    })

    it('fast tasks - singleton mode', async () => {
      const taskNum = 10
      const result = await runner.executeTasks({}, taskNum, 0, {
        duration: 50,
        singleton: true
      })
      assert.equal(taskNum, result.done)
      assert(result.series)
    })

    it('fast tasks - throttle mode', async function () {
      const taskNum = 3
      const result = await runner.executeTasks({}, taskNum, 0, {
        duration: 50,
        throttle: true
      })
      assert.equal(1, result.done)
      assert.equal(taskNum - 1, result.refused)
    })

    it('fast tasks - throttle, trailing mode', async function () {
      const taskNum = 3
      const result = await runner.executeTasks({}, taskNum, 0, {
        duration: 50,
        throttle: true,
        trailing: true
      })
      assert.equal(2, result.done)
      assert.equal(taskNum - 2, result.refused)
    })

    it('fast tasks - singleton, throttle, trailing mode', async function () {
      const taskNum = 3

      let result = await runner.executeTasks({}, taskNum, 0, {
        duration: 50,
        singleton: true,
        throttle: true,
        trailing: true
      })
      assert.equal(result.done, 2)
      assert(result.series)
    })
  })

  describe('complex case', function () {
    it('slow tasks - singleton mode', async function () {
      const taskNum = 5
      const result = await runner.executeTasks({}, taskNum, 0, {
        duration: 4500,
        singleton: true
      })
      assert.equal(taskNum, result.done)
      assert(result.series)
    })

    it('periodic tasks - throttle mode', async function () {
      const taskNum = 6
      const result = await runner.executeTasks({}, taskNum, 1000, {
        duration: 50,
        throttle: true
      })
      assert.equal(result.done, 2)
    })

    it('periodic tasks - singleton, throttle,  mode', async function () {
      const taskNum = 4
      const result = await runner.executeTasks({}, taskNum, 1000, {
        duration: 6000,
        singleton: true,
        throttle: true,
        trailing: true
      })
      assert.equal(result.done, 2)
      assert(result.time >= 12000)
    })
  })

  describe('order', function () {
    it('five', async function () {
      const taskNum = 5
      const result = await runner.executeTasks({}, taskNum, 1, {
        duration: 50,
        singleton: true
      })
      assert.equal(result.done, 5)
      assert.deepEqual(result.timestamps, sortBy(clone(result.timestamps)))
    })

    it('ten', async function () {
      const taskNum = 10
      const result = await runner.executeTasks({}, taskNum, 1, {
        duration: 50,
        singleton: true
      })
      assert.equal(result.done, 10)
      assert.deepEqual(result.timestamps, sortBy(clone(result.timestamps)))
    })
  })
})
