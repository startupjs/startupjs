const detox = require('detox')
// const jasmine = require('jasmine')
// const adapter = require('detox/runners/jest/adapter')
const config = require('./config.json')

jest.setTimeout(30000)
// jasmine.getEnv().addReporter(adapter)

beforeAll(async () => {
  await detox.init(config)
  global.x = require('./helpers').default
})

// beforeEach(async () => {
// await adapter.beforeEach()
// })

afterAll(async () => {
  // await adapter.afterAll()
  await detox.cleanup()
})
