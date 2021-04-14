module.exports = `const { x } = require('@startupjs/e2e/helpers')

describe('Example', () => {
  it('should have welcome screen', async () => {
    await x('#welcome').toBeVisible()
  })

  it('should show hello screen after tap', async () => {
    await x('#hello_button').tap()
    await x('=Hello!!!').toBeVisible()
  })

  it('should show world screen after tap', async () => {
    await x('#world_button').tap()
    await x('=World!!!').toBeVisible()
  })
})
`
