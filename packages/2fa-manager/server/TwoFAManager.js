import { Provider as ParentProvider } from '../Provider/index.js'

// options = {
//   providers: [
//     {
//       Provider: class Provider,
//       options: {}
//     }
//   ]
// }

export default class TwoFAManager {
  constructor (ee, options) {
    if (TwoFAManager._instance) {
      return TwoFAManager._instance
    }
    TwoFAManager._instance = this

    this.providers = []
    this.initProviders(ee, options.providers)
  }

  async send (model, session, providerName) {
    const provider = this._getProvider(providerName)
    await provider.send(model, session)
  }

  async check (model, session, token, providerName) {
    const provider = this._getProvider(providerName)
    return await provider.check(model, session, token)
  }

  initProviders (ee, providers) {
    for (const provider of providers) {
      const [Provider, options] = provider
      const _provider = new Provider(ee, options || {})
      if (_provider instanceof ParentProvider) {
        this.providers.push(_provider)
      } else {
        throw new Error(`[TwoFAManager.constructor]: Provider ${provider} must be instanse of Provider from @startupjs/2fa-manager/Provider!`)
      }
    }
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
}
