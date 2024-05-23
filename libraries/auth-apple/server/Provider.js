import { BaseProvider } from '@startupjs/auth/server/index.js'

const PROVIDER_NAME = 'apple'

export default class AppleProvider extends BaseProvider {
  getProviderName () {
    return PROVIDER_NAME
  }

  getProviderId () {
    const { profile } = this
    return profile.id
  }

  getFindUserQuery () {
    const { profile } = this
    return { 'providers.apple.id': profile.id }
  }

  getAvatarUrl () {
    return null
  }

  getEmail () {
    const { profile } = this
    return profile.email || ''
  }

  getFirstName () {
    const { profile } = this

    if (profile.fullName) {
      return profile.fullName.givenName
    }

    if (profile.name) {
      return profile.name.firstName
    }

    return ''
  }

  getLastName () {
    const { profile } = this

    if (profile.fullName) {
      return profile.fullName.familyName
    }

    if (profile.name) {
      return profile.name.lastName
    }

    return ''
  }

  getName () {
    const firstName = this.getFirstName()
    const lastName = this.getLastName()
    const name = firstName + ' ' + lastName || ''
    return name
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
