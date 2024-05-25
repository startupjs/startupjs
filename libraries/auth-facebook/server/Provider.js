import { BaseProvider } from '@startupjs/auth/server/index.js'

const PROVIDER_NAME = 'facebook'

export default class FacebookProvider extends BaseProvider {
  constructor ($root, profile, options) {
    super($root, profile, options)
    this.profile = profile
  }

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

    if (profile.name && (typeof profile.name === 'string') && profile.name.split(' ')[0]) {
      return profile.name.split(' ')[0]
    }
    if (profile._json && profile._json.first_name) {
      return profile._json.first_name
    }

    return ''
  }

  getLastName () {
    const { profile } = this

    if (profile.name && (typeof profile.name === 'string') && profile.name.split(' ')[1]) {
      return profile.name.split(' ')[1]
    }
    if (profile._json && profile._json.last_name) {
      return profile._json.last_name
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

    if (profile.photos && profile.photos[0]) {
      return profile.photos[0].value
    }

    if (profile.picture && profile.picture.data) {
      return profile.picture.data.url
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
