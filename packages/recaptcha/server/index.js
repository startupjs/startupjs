import checkToken from './checkToken'
import checkDataToken from './checkDataToken'
import { setRecaptchaSiteKey } from './middlewares'

function initRecaptcha (ee) {
  ee.on('afterSession', expressApp => {
    expressApp.use(setRecaptchaSiteKey)
  })
}

export { checkToken, initRecaptcha, checkDataToken }
