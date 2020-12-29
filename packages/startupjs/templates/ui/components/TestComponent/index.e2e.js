describe('Counter tests', () => {
  const initialValue = 0

  it('should be initial value', async () => {
    await x('#spanCounter').toBeVisible()
    await x('#spanCounter').toHaveText(initialValue.toString())
  })

  it('should increment counter', async () => {
    const counterValue = await x('#spanCounter').getAttributes().text

    await x('#buttonPlus').toBeVisible()
    await x('#buttonPlus').tap()
    await x('#buttonPlus').tap()
    await x('#buttonPlus').tap()
    await x('#spanCounter').toHaveText((+counterValue + 3).toString())
  })

  it('should decrement counter', async () => {
    const counterValue = await x('#spanCounter').getAttributes().text

    await x('#buttonMinus').toBeVisible()
    await x('#buttonMinus').tap()
    await x('#spanCounter').toHaveText((+counterValue - 1).toString())
  })

  it('should reset counter', async () => {
    await x('= RESET').toBeVisible()
    await x('= RESET').tap()
    await x('#spanCounter').toHaveText(initialValue.toString())
  })
})
