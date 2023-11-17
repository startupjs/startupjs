import { BaseProvider } from '@startupjs/auth/server/index.js'

const PROVIDER_NAME = 'azuread'

export default class LinkedinProvider extends BaseProvider {
  getProviderName () {
    return PROVIDER_NAME
  }

  getProviderId () {
    const { profile } = this
    return profile.id || profile.sub
  }

  getEmail () {
    const { profile } = this
    const email = (profile._json && profile._json.email) ||
      (typeof profile.email === 'string' && profile.email) ||
      (profile.emails && profile.emails[0] && profile.emails[0].value)

    return email ? email.toLowerCase() : undefined
  }

  getFirstName () {
    const { profile } = this

    let firstName = ''
    if (profile.firstName) {
      firstName = profile.firstName
    } else {
      const { displayName } = profile
      firstName = (displayName || []).split(' ')[0]
    }

    return firstName
  }

  getLastName () {
    const { profile } = this

    let lastName = ''
    if (profile.lastName) {
      lastName = profile.lastName
    } else {
      const { displayName } = profile
      lastName = (displayName || []).split(' ')[1]
    }

    return lastName
  }

  getName () {
    const { profile } = this

    if (profile.displayName) {
      return profile.displayName
    }

    return profile.firstName + ' ' + profile.lastName
  }

  getAvatarUrl () {
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
