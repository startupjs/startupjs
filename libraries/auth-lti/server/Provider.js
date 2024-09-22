import { BaseProvider } from '@startupjs/auth/server/index.js'

const PROVIDER_NAME = 'lti'

export default class LTIProvider extends BaseProvider {
  constructor ($root, profile, options) {
    super($root, profile, options)
    this.profile = profile
  }

  getProviderName () {
    return PROVIDER_NAME
  }

  getProviderId () {
    const { profile } = this
    return profile.id
  }

  getEmail () {
    const { profile } = this
    return profile.email
  }

  getFirstName () {
    const { profile } = this
    return profile.firstname
  }

  getLastName () {
    const { profile } = this
    return profile.lastname
  }

  getName () {
    const firstName = this.getFirstName()
    const lastName = this.getLastName()
    return [firstName, lastName].filter(Boolean).join(' ')
  }

  getAvatarUrl () {
    return null
  }

  getProviderData () {
    return {}
  }

  getRawProviderData () {
    return this.profile
  }
}
