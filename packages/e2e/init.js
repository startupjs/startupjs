jest.setTimeout(30000)

beforeAll(async () => {
  await device.launchApp()
  global.x = require('./helpers')
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
