const { jestExpect, matchImageSnapshot } = require('@startupjs/e2e')
const x = require('@startupjs/e2e/helpers')
const { goTo } = require('./helpers')

beforeEach(async () => {
  await goTo('Button')
})

describe('Button', () => {
  it('should click on the button', async () => {
    await x('#primaryButton').toHaveLabel('Clicked 0 times')
    await x('#primaryButton').tap()
    await x('#primaryButton').tap()
    await x('#primaryButton').toHaveLabel('Clicked 2 times')
  })

  it('should render async button', async () => {
    await x('#asyncButton').toBeVisible()
    await x('#asyncButton').tap()
    await waitFor(element(by.id('asyncButton'))).toHaveLabel('Async operation - done').withTimeout(10000)
  })

  it('should render disabled button', async () => {
    await x('#disabledButton').toBeVisible()
    await x('#disabledButton').tap()
  })

  it('should render size="xs" Button', async () => {
    await x('#xsButton').toBeVisible()
    const attr = await x('#xsButton').getAttributes()
    jestExpect(attr.frame.height).toBe(16)
  })

  it('Screenshots: Buttons page', async () => {
    const imagePath = await device.takeScreenshot('Buttons page')
    matchImageSnapshot(imagePath)
  })
})
