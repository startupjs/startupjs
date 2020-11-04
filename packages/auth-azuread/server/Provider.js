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
    const { displayName } = profile
    const [firstName] = (displayName || []).split(' ')
    return firstName
  }

  getLastName () {
    const { profile } = this
    const { displayName } = profile
    const [, lastName] = (displayName || []).split(' ')
    return lastName
  }

  getName () {
    const { profile } = this
    const { displayName } = profile
    return displayName
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
