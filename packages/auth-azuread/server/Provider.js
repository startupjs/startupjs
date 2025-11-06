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

    if (profile.name?.givenName) return profile.name.givenName
    if (profile._json?.given_name) return profile._json.given_name

    if (profile.displayName) {
      const nameStr = profile.displayName.trim()
      const commaParts = nameStr.split(',')
      if (commaParts.length === 2) {
        return commaParts[1].trim()
      }

      const parts = nameStr.split(/\s+/)
      return parts[0] || ''
    }

    return ''
  }

  getLastName () {
    const { profile } = this

    if (profile.name?.familyName) return profile.name.familyName
    if (profile._json?.family_name) return profile._json.family_name

    if (profile.displayName) {
      const nameStr = profile.displayName.trim()
      const commaParts = nameStr.split(',')
      if (commaParts.length === 2) {
        return commaParts[0].trim()
      }

      const parts = nameStr.split(/\s+/)
      if (parts.length > 1) {
        return parts.slice(1).join(' ')
      }
    }

    return ''
  }

  getName () {
    const { profile } = this

    if (profile.displayName) {
      return profile.displayName
    }

    const firstName = this.getFirstName()
    const lastName = this.getLastName()

    if (firstName || lastName) {
      return [firstName, lastName].filter(Boolean).join(' ')
    }

    return ''
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
