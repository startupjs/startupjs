import { BaseProvider } from '@startupjs/auth/server'

const PROVIDER_NAME = 'telegram'

export default class Provider extends BaseProvider {
  getProviderName () {
    return PROVIDER_NAME
  }

  getProviderId () {
    return this.profile.id
  }

  getEmail () {
    return ''
  }

  getFirstName () {
    const { profile } = this
    return profile.first_name || profile.name.givenName
  }

  getLastName () {
    const { profile } = this
    return profile.last_name
  }

  getName () {
    const firstName = this.getFirstName()
    const lastName = this.getLastName()
    return [firstName, lastName].filter(Boolean).join(' ')
  }

  getAvatarUrl () {
    const { profile } = this
    return profile.photo_url || profile.photos[0].value
  }

  getProviderData () {
    return {
      email: this.getEmail()
    }
  }

  getRawProviderData () {
    return this.profile
  }
}
