import defaults from 'lodash/defaults.js'
import checkRecaptcha from './checkRecaptcha.js'
import checkDataRecaptcha from './checkDataRecaptcha.js'
import { setRecaptcha } from './middlewares/index.js'

function initRecaptcha (ee, options) {
  options = defaults(options, { type: 'v3' })
  ee.on('afterSession', expressApp => {
    expressApp.use(setRecaptcha(options))
  })
}

function getRecaptchaHead (req) {
  switch (req.model.get('_session.Recaptcha.type')) {
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
