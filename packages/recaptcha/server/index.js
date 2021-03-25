import checkToken from './checkToken'
import { setRecaptchaSiteKey } from './middlewares'

function initRecaptcha (ee) {
  ee.on('afterSession', expressApp => {
    expressApp.use(setRecaptchaSiteKey)
  })
}

export { checkToken, initRecaptcha }
