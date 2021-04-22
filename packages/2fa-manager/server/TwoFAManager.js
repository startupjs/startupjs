import { Provider } from '../Provider'

export default class TwoFAManager {
  constructor (options) {
    if (TwoFAManager._instance) {
      return TwoFAManager._instance
    }
    TwoFAManager._instance = this

    this._isValidOptions(options)
    this.providers = options.providers || []
  }

  send (model, session, providerName) {
    const provider = this.getProvider(providerName)
    provider.send(model, session)
  }

  check (model, session, token, providerName) {
    const provider = this.getProvider(providerName)
    provider.check(model, session, token)
  }

  getProviders () {
    return this.providers.map(provider => provider.getName())
  }

  _getProvider (providerName) {
    const provider = this.providers.find(provider => provider.getName() === providerName)
    if (!provider) {
      throw new Error(`[TwoFAManager._getProvider]: Provider ${provider} doesn't exist!`)
    }

    return provider
  }

  _isValidOptions (options) {
    options.providers.forEach(provider => {
      if (!(provider instanceof Provider)) {
        throw new Error(`[TwoFAManager.constructor]: Provider ${provider} must be instanse of Provider from @startupjs/2fa-manager/Provider!`)
      }
    })
  }
}
