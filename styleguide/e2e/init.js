const detox = require('detox')
// const adapter = require('detox/runners/jest/adapter')
// const config = require('./config.json')

jest.setTimeout(30000)
// jasmine.getEnv().addReporter(adapter)

beforeAll(async () => {
  // await detox.init()
  global.x = require('./helpers')
})

afterAll(async () => {
  await detox.cleanup()
})

async function wait () {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
}

beforeEach(async () => {
  await device.reloadReactNative()
  await wait()
})
