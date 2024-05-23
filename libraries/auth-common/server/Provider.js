import { BaseProvider } from '@startupjs/auth/server/index.js'

export default class CommonProvider extends BaseProvider {
  getProviderName () {
    return this.options.providerName
  }

  getProviderId () {
    const { profile } = this
    return profile.id
  }

  getAvatarUrl () {
    const { profile } = this
    return profile.avatarUrl || ''
  }

  getEmail () {
    const { profile } = this
    return profile.email || ''
  }

  getFirstName () {
    const { profile } = this
    return profile.firstName || ''
  }

  getLastName () {
    const { profile } = this
    return profile.lastName || ''
  }

  getName () {
    const firstName = this.getFirstName()
    const lastName = this.getLastName()
    const name = firstName + ' ' + lastName
    return name
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
