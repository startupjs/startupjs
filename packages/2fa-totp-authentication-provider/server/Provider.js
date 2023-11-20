import { Provider } from '@startupjs/2fa-manager/Provider/index.js'
import { checkToken } from '@startupjs/2fa-totp-authentication/server/helpers/index.js'
import { init2fa } from '@startupjs/2fa-totp-authentication/server/index.js'

export default class TotpProvider extends Provider {
  constructor (ee, options) {
    super('google-authenticator')
    this.init(ee, options)
  }

  init (ee, options) {
    init2fa(ee, options)
  }

  async check (model, session, token) {
    return checkToken(model, session, token)
  }
}
