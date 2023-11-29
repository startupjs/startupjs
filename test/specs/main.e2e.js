describe('Main', () => {
  it('should redirect to Quickstart and show it', async () => {
    await browser.url('/')
    await expect($('h2=StartupJS')).toBeExisting()
    await expect($('div*=Just imagine what you can')).toBeExisting()
  })
})

// await $('#username').setValue('tomsmith')
// await $('#password').setValue('SuperSecretPassword!')
// await $('button[type="submit"]').click()

// await expect($('#flash')).toBeExisting()
// await expect($('#flash')).toHaveTextContaining(
//   'You logged into a secure area!')
