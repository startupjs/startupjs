import { BaseProvider } from '@startupjs/auth/server'

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
    // const { profile } = this
    return undefined
  }

  getLastName () {
    // const { profile } = this
    return undefined
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
    // const { profile } = this
    return undefined
  }

  getProviderData () {
    return {}
  }

  getRawProviderData () {
    return this.profile
  }
}
