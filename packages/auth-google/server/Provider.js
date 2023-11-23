import { BaseProvider } from '@startupjs/auth/server/index.js'

const PROVIDER_NAME = 'google'

export default class GoogleProvider extends BaseProvider {
  getProviderName () {
    return PROVIDER_NAME
  }

  getProviderId () {
    return this.profile.id || this.profile.sub
  }

  getEmail () {
    const { profile } = this
    let email

    if (profile._json && profile._json.email) {
      email = profile._json.email
    }
    if (typeof profile.email === 'string' && profile.email) {
      email = profile.email
    }
    if (profile.emails && profile.emails[0] && profile.emails[0].value) {
      email = profile.emails[0].value
    }

    return email ? email.toLowerCase() : undefined
  }

  getFirstName () {
    const { profile } = this
    return profile.given_name || (profile.name && profile.name.givenName)
  }

  getLastName () {
    const { profile } = this
    return profile.family_name || (profile.name && profile.name.familyName)
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

    if (profile.picture) {
      return profile.picture.replace(/=s96-c/gi, '=s400')
    }

    if (profile.photos && profile.photos[0]) {
      return profile.photos[0].value.replace(/=s96-c/gi, '=s400')
    }
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
