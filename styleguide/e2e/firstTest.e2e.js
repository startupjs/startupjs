describe('Test suite 1', () => {
  it('should have logo', async () => {
    await x('#button').tap()
    await x('#logo').toBeVisible()
  })
})

describe('Example', () => {
  it('should change languages', async () => {
    await x('#button').tap()
    await x('= English').tap()
    await x('UIPickerView').toBeVisible()
    await x('UIPickerView').setColumnToValue(0, 'Русский')
    await x('= Done').tap()
    await x('= Общее').toBeVisible()
  })
})
