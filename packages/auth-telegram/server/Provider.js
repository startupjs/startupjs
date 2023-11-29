import { BaseProvider } from '@startupjs/auth/server/index.js'

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

    if (profile.photo_url) {
      return profile.photo_url
    }

    if (profile.photos?.length) {
      return profile.photos[0].value
    }

    return null
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
