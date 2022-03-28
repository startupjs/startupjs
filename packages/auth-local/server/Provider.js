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
}
