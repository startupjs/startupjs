export default class BaseProvider {
  constructor ($root, profile, options) {
    this.$root = $root
    this.profile = profile
    this.options = options || {}
  }

  getCustomUserData (userData) {
    return userData
  }

  getCustomAuthData (authData) {
    return authData
  }

  getFindUserQuery () {
    return { email: this.getEmail() }
  }

  async findOrCreateUser () {
    const { $root } = this
    const providerName = this.getProviderName()
    const authQuery = $root.query('auths', this.getFindUserQuery())
    await authQuery.fetchAsync()
    let userId = authQuery.getIds()[0]

    if (userId) {
      const $auth = $root.scope('auths.' + userId)
      const providers = $auth.get('providers') || {}
      if (!providers[providerName]) {
        $auth.set(
          'providers.' + providerName,
          this.getAuthData().providers[providerName]
        )
      }
    } else {
      userId = await this.createUser()
    }

    authQuery.unfetch()
    return userId
  }

  async createUser () {
    const { $root } = this
    const userId = $root.id()
    let authData = {
      id: userId,
      email: this.getEmail(),
      ...this.getAuthData(),
      createdAt: Date.now()
    }

    authData = await this.getCustomAuthData(authData)
    await $root.addAsync('auths', authData)

    let userData = this.getUserData()
    const user = {
      id: userId,
      ...userData,
      createdAt: Date.now()
    }

    userData = await this.getCustomUserData(user, authData)
    await $root.addAsync('users', userData)
    return userId
  }

  getUserData () {
    return {
      name: this.getName(),
      firstName: this.getFirstName(),
      lastName: this.getLastName(),
      avatarUrl: this.getAvatarUrl()
    }
  }

  getAuthData () {
    return {
      providers: {
        [this.getProviderName()]: {
          ...this.getProviderData(),
          _raw: this.getRawProviderData(),
          id: this.getProviderId()
        }
      }
    }
  }

  getProviderName () {
    throw new Error('getProviderName() not implemented!')
  }

  getProviderId () {
    throw new Error('getId() not implemented!')
  }

  getEmail () {
    throw new Error('getEmail() not implemented!')
  }

  getFirstName () {
    throw new Error('getFirstName() not implemented!')
  }

  getLastName () {
    throw new Error('getLastName() not implemented!')
  }

  getAvatarUrl () {
    throw new Error('getAvatarUrl() not implemented!')
  }

  getProviderData () {
    throw new Error('getProviderData() not implemented!')
  }

  getRawProviderData () {
    throw new Error('getRawProviderData() not implemented')
  }
}
