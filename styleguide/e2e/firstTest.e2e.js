describe('Test suite 1', () => {
  it('should have logo', async () => {
    await x('#button').tap()
    await x('#logo').toBeVisible()
  })
})

describe('Example', () => {
  it('should change languages', async () => {
    await element(by.id('button')).tap()
    await expect(element(by.text('English'))).toBeVisible().tap()
    await expect(element(by.type('UIPickerView'))).toBeVisible()
    await element(by.type('UIPickerView')).setColumnToValue(1, 'ru')
    await element(by.label('Confirm')).tap()
    await x('= Основы').toBeVisible()
  })
})
