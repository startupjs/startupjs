// const config = require('./config.json')

describe('Example', () => {
  // beforeAll(async () => {
  //   // await device.reloadReactNative()
  //   // console.log(detox.init())
  //   await detox.init(config)
  //   // console.log('tut2')
  // })

  // it('should have Layout', async () => {
  //   await waitFor(element(by.id('Layout'))).toBeVisible().withTimeout(4000)
  // })

  it('should have Layout2', async () => {
    setTimeout(async () => await element(x('#button')).tap(), 4000)
    setTimeout(async () => await expect(element(x('#logo'))).toBeVisible(), 4000)
  })

  // it('should show hello screen after tap', async () => {
  //   await element(by.id('hello_button')).tap()
  //   await expect(element(by.text('Hello!!!'))).toBeVisible()
  // })

  // it('should show world screen after tap', async () => {
  //   await element(by.id('world_button')).tap()
  //   await expect(element(by.text('World!!!'))).toBeVisible()
  // })
})
