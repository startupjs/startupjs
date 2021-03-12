const { execSync } = require('child_process')

jest.setTimeout(30000)

beforeAll(async () => {
  execSync(
    'xcrun simctl status_bar "iPhone 11" override --time "12:00" --batteryState charged --batteryLevel 100 --wifiBars 3 --cellularMode active --cellularBars 4'
  )
  await device.launchApp()
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
