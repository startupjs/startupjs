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
    return (profile.name && profile.name.givenName) || ''
  }

  getLastName () {
    const { profile } = this
    return (profile.name && profile.name.familyName) || ''
  }

  getName () {
    const firstName = this.getFirstName()
    const lastName = this.getLastName()
    return [firstName, lastName].filter(Boolean).join(' ')
  }

  getAvatarUrl () {
    return ''
  }

  getProviderData () {
    return {}
  }

  getRawProviderData () {
    return this.profile
  }
}
