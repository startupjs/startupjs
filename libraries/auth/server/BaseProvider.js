import { auth } from './index.js'

export default class BaseProvider {
  constructor ($root, profile, options) {
    this.$root = $root
    this.profile = profile
    this.options = options || {}
  }

  async getFindUserQuery () {
    // Generally we don't need an provider id to perform auth
    // auth proces depends on provider.email field only
    // but earlier implementation of auth lib used provideer.id in local strategy
    // Those lines is added only for backward compabilities reasons
    const query = {
      $or: [
        { [`providers.${this.getProviderName()}.id`]: this.getProviderId() }
      ]
    }

    // We can't use $where because of it supports in mongodb < 4.4
    // and can't use $function because of it supports in mongodb > 4.4
    // use $function when all our libraries use mongodb > 4.4
    const email = this.getEmail()

    if (email) {
      auth.config.strategies.forEach(func => {
        query.$or.push({
          [`providers.${func.providerName}.email`]: this.getEmail()
        })
      })
    }

    return query
  }

  async findOrCreateUser ({ req }) {
    const { $root } = this

    let findUserQuery = await this.getFindUserQuery()
    if (this.options.patchFindUserQuery) {
      findUserQuery = this.options.patchFindUserQuery(findUserQuery, req)
    }
    const $auths = $root.query('auths', findUserQuery)
    await $auths.fetch()

    let userId = $auths.getIds()[0]

    if (userId) {
      const $auth = $root.scope('auths.' + userId)
      const providers = $auth.get('providers') || {}
      const providerName = this.getProviderName()

      if (!providers[providerName]) {
        await $auth.set(
          'providers.' + providerName,
          this.getAuthData().providers[providerName]
        )
      }
    } else {
      userId = await this.createUser({ req })
    }

    $auths.unfetch()
    return userId
  }

  async createUser ({ req }) {
    const { $root } = this
    const userId = $root.id()

    const userFields = {
      id: userId,
      createdAt: Date.now(),
      ...this.getUserData()
    }

    // Extend base collection of user fields with custom data in overrided parseUserCreationData hook
    const parseUserCreationDataRes = this.options.parseUserCreationData({ ...userFields }, req)
    // Check if returned promise
    const parsedUserFields = parseUserCreationDataRes.then ? await parseUserCreationDataRes : parseUserCreationDataRes

    await $root.addAsync('users', {
      ...userFields,
      ...parsedUserFields
    })

    const authData = {
      id: userId,
      email: this.getEmail(),
      createdAt: Date.now(),
      ...this.getAuthData(),
      ...(this.options.getCreationAuthData ? this.options.getCreationAuthData(req) : {})
    }

    await $root.addAsync('auths', authData)

    const hookRes = this.options.onAfterUserCreationHook({ userId }, req)
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
