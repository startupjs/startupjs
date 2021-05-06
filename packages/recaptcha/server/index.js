import defaults from 'lodash/defaults'
import checkRecaptcha from './checkRecaptcha'
import checkDataRecaptcha from './checkDataRecaptcha'
import { setRecaptcha } from './middlewares'

function initRecaptcha (ee, options) {
  options = defaults(options, { type: 'v3' })
  ee.on('afterSession', expressApp => {
    expressApp.use(setRecaptcha(options))
  })
}

export {
  checkRecaptcha,
  initRecaptcha,
  checkDataRecaptcha
}
