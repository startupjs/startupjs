import defaults from 'lodash/defaults'
import checkRecaptcha from './checkRecaptcha'
import checkDataRecaptcha from './checkDataRecaptcha'
import { setRecaptcha } from './middlewares'

function initRecaptcha (ee, options) {
  options = defaults(options, { type: 'v3' })
  ee.on('afterSession', expressApp => {
    expressApp.use(setRecaptcha(options))
  })
  global.Recaptcha = options
}

function getRecaptchaHead () {
  switch (global.Recaptcha.type) {
    case 'enterprise':
      return '<script src="https://www.google.com/recaptcha/enterprise.js" async>'
    case 'v3':
      return '<script src="https://www.google.com/recaptcha/api.js?render=explicit" async></script>'
  }
}

export {
  checkRecaptcha,
  initRecaptcha,
  checkDataRecaptcha,
  getRecaptchaHead
}
