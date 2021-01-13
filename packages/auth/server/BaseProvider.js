export default class BaseProvider {
  constructor ($root, profile, options) {
    this.$root = $root
    this.profile = profile
    this.options = options || {}
  }

  getFindUserQuery () {
    const email = this.getEmail()

    return {
      $or: [
        {
          [`providers.${this.getProviderName()}.email`]: email
        },
        // Generally we don't need an provider id to perform auth
        // auth proces depends on provider.email field only
        // but earlier implementation of auth lib used provideer.id in local strategy
        // Those lines is added only for backward compabilities reasons
        {
          [`providers.${this.getProviderName()}.id`]: this.getProviderId()
        },
        { email }
      ]
    }
  }

  async findOrCreateUser () {
    const { $root } = this

    const providerName = this.getProviderName()
    const $auths = $root.query('auths', this.getFindUserQuery())
    await $auths.fetchAsync()

    let userId = $auths.getIds()[0]

    if (userId) {
      const $auth = $root.scope('auths.' + userId)
      const providers = $auth.get('providers') || {}
      if (!providers[providerName]) {
        await $auth.set(
          'providers.' + providerName,
          this.getAuthData().providers[providerName]
        )
      }
    } else {
      userId = await this.createUser()
    }

    $auths.unfetch()
    return userId
  }

  async createUser () {
    const { $root } = this
    const userId = $root.id()

    const immutableUserFields = {
      id: userId,
      createdAt: Date.now(),
      ...this.getUserData()
    }

    // Extend base collection of user fields with custom data in overrided parseUserCreationData hook
    const parseUserCreationDataRes = this.options.parseUserCreationData({ ...immutableUserFields })
    // Check if returned promise
    const parsedUserFields = parseUserCreationDataRes.then ? await parseUserCreationDataRes : parseUserCreationDataRes

    // Some fileds like id and email must be immutable so we can't allow to change it
    await $root.addAsync('users', {
      ...parsedUserFields,
      ...immutableUserFields
    })

    const authData = {
      id: userId,
      email: this.getEmail(),
      createdAt: Date.now(),
      ...this.getAuthData()
    }

    await $root.addAsync('auths', authData)

    const hookRes = this.options.onAfterUserCreationHook(userId)
    // Check if returned promise
    hookRes && hookRes.then && await hookRes

    return userId
  }

  getUserData () {
    return {
      email: this.getEmail(),
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
