import { strict as assert } from 'assert'
import path from 'path'
import DispatcherRunner from './utils.js'
import { __dirname } from './__dirname.js'

describe('tasks', function () {
  const runner = new DispatcherRunner()
  this.timeout(60000)

  before(async () => {
    process.env.WORKER_TASK_DEFAULT_TIMEOUT = '5000'
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

  describe('simple case', function () {
    it('timeout sec', async () => {
      const taskNum = 1
      const result = await runner.executeTasks({}, taskNum, 0, { duration: 8000 })
      assert.equal(taskNum, result.error)
    })
  })
})
