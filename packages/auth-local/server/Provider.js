import { BaseProvider } from '@startupjs/auth/server'
import _pick from 'lodash/pick'
const PROVIDER_NAME = 'local'

export default class LocalProvider extends BaseProvider {
  constructor (model, profile, config) {
    super(model, profile, config)

    const methods = _pick(config, ['getUserData'])
    Object.assign(this, methods)
  }

  getProviderName () {
    return PROVIDER_NAME
  }

  getProviderId () {
    return this.getEmail()
  }

  getEmail () {
    return this.profile.email
  }

  getFirstName () {
    return this.profile.firstName
  }

  getLastName () {
    return this.profile.lastName
  }

  getRawProviderData () {
    return null
  }

  getName () {
    const firstName = this.getFirstName()
    const lastName = this.getLastName()
    const name = [firstName, lastName].filter(Boolean).join(' ')
    return name
  }

  getAvatarUrl () {
    return ''
  }

  getProviderData () {
    const { hash, salt, unconfirmed } = this.profile
    const data = {
      hash,
      salt,
      email: this.getEmail()
    }
    if (unconfirmed) data.unconfirmed = true
    return data
  }

  async loadAuthData () {
    let data
    if (this.options.loadAuthData) {
      data = await this.options.loadAuthData.call(this)
    } else {
      data = await this._loadAuthData()
    }
    return data
  }

  async _loadAuthData () {
    const { $root } = this
    const authQuery = $root.query('auths', {
      $or: [
        { 'providers.local.email': this.getEmail() },
        // Generally we don't need an provider id to perform auth
        // auth proces depends on provider.email field only
        // but earlier implementation of auth lib used provideer.id in local strategy
        // Those lines is added only for backward compabilities reasons
        { 'providers.local.id': this.getEmail() }
      ]
    })
    await authQuery.fetchAsync()
    const id = authQuery.getIds()[0]
    if (!id) return
    let data = $root.scope('auths.' + id)
    data = data.get()
    authQuery.unfetch()
    return data
  }
}
