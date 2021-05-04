import checkToken from './checkToken'
import checkDataToken from './checkDataToken'
import { setRecaptchaSiteKey } from './middlewares'

function initRecaptcha (ee, options) {
  ee.on('afterSession', expressApp => {
    expressApp.use((req, res, next) => {
      const $session = req.model.scope('_session')
      $session.setEach('Recaptcha', options)
      next()
    })

    expressApp.use(setRecaptchaSiteKey)
  })
}

export {
  checkToken,
  initRecaptcha,
  checkDataToken
}
