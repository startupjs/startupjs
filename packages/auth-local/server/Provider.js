import { BaseProvider } from '@startupjs/auth/server'
const PROVIDER_NAME = 'local'

export default class LocalProvider extends BaseProvider {
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
    const { $root } = this
    const authQuery = $root.query('auths', {
      email: this.getEmail(),
      'providers.local': { $exists: true }
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
