import { BaseProvider } from '@startupjs/auth/server'

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

    let firstName =
      profile.name?.givenName ||
      profile._json?.given_name ||
      ''

    if (!firstName && profile.displayName) {
      const parts = profile.displayName.trim().split(/\s+/)
      firstName = parts[0]
    }

    return firstName || ''
  }

  getLastName () {
    const { profile } = this

    let lastName =
      profile.name?.familyName ||
      profile._json?.family_name ||
      ''

    if (!lastName && profile.displayName) {
      const parts = profile.displayName.trim().split(/\s+/)
      if (parts.length > 1) {
        lastName = parts.slice(1).join(' ')
      }
    }

    return lastName || ''
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
