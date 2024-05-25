import { BaseProvider } from '@startupjs/auth/server/index.js'

const PROVIDER_NAME = 'linkedin'

export default class LinkedinProvider extends BaseProvider {
  getProviderName () {
    return PROVIDER_NAME
  }

  getProviderId () {
    const { profile } = this
    return profile.id
  }

  getEmail () {
    const { profile } = this
    const email = profile.email

    return email ? email.toLowerCase() : undefined
  }

  getFirstName () {
    const { profile } = this

    if (profile.firstName) return profile.firstName
    if (profile.name && profile.name.givenName) {
      return profile.name.givenName
    }

    return ''
  }

  getLastName () {
    const { profile } = this

    if (profile.lastName) return profile.lastName
    if (profile.name && profile.name.familyName) {
      return profile.name.familyName
    }

    return ''
  }

  getName () {
    const { profile } = this
    let name
    const firstName = this.getFirstName()
    const lastName = this.getLastName()
    if (profile.displayName) {
      name = profile.displayName
    } else if (typeof profile.name === 'string') {
      name = profile.name
    } else if (firstName || lastName) {
      name = [firstName, lastName].filter(Boolean).join(' ')
    }
    return name
  }

  getAvatarUrl () {
    const { profile } = this
    if (profile.picture && profile.picture.value) {
      return profile.picture.value
    }

    return ''
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
