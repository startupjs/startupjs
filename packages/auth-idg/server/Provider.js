import { BaseProvider } from '@startupjs/auth/server/index.js'

const PROVIDER_NAME = 'idecisiongames'

export default class IdecisiongamesProvider extends BaseProvider {
  getProviderName () {
    return PROVIDER_NAME
  }

  getProviderId () {
    const { profile } = this
    return profile.user_id
  }

  getEmail () {
    const { profile } = this
    return profile.email ? profile.email.toLowerCase() : undefined
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
    const { profile } = this
    return profile.avatar
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
