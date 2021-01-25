jest.setTimeout(30000)

beforeAll(async () => {
  await device.installApp()
  await device.launchApp()
  global.x = require('./helpers')
})

afterAll(async () => {
  await device.uninstallApp()
})

async function wait () {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 5000)
  })
}

beforeEach(async () => {
  await device.reloadReactNative()
  await wait()
})
