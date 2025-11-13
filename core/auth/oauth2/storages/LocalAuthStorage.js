import { $, sub } from 'teamplay'
import AuthStorage from './AuthStorage.js'

/**
 * Local database storage implementation using StartupJS scoped models
 * This maintains the current behavior of the auth plugin
 */
export default class LocalAuthStorage extends AuthStorage {
  /**
   * Find a user by their provider and provider ID using StartupJS scoped models
   */
  async findUserByProvider (provider, providerId, filterParams = {}) {
    const [$auth] = await sub($.auths, { [`${provider}.id`]: providerId, ...filterParams })
    if (!$auth?.get()) return null
    return { $auth, auth: $auth.get(), userId: $auth.getId() }
  }

  /**
   * Get a user by their unique user ID using StartupJS scoped models
   */
  async getUserById (userId) {
    const $auth = await sub($.auths[userId])
    if (!$auth?.get()) return null
    return { $auth, auth: $auth.get(), userId: $auth.getId() }
  }

  /**
   * Find a user by their email address using StartupJS scoped models
   */
  async findUserByEmail (email, additionalQuery = {}) {
    const [$auth] = await sub($.auths, {
      email,
      ...additionalQuery
    })
    if (!$auth?.get()) return null
    return { $auth, auth: $auth.get(), userId: $auth.getId() }
  }

  /**
   * Find a user by their provider secret using StartupJS scoped models
   */
  async findUserBySecret (provider, secret) {
    const [$auth] = await sub($.auths, { [`${provider}.secret`]: secret })
    if (!$auth?.get()) return null
    return { $auth, auth: $auth.get(), userId: $auth.getId() }
  }

  /**
   * Create a new user using StartupJS scoped models
   */
  async createUser (authData) {
    const userId = await $.auths.add({ ...authData, createdAt: Date.now() })
    const $auth = await sub($.auths[userId])
    return { $auth, auth: $auth.get(), userId }
  }

  /**
   * Add a new authentication provider to an existing user using StartupJS scoped models
   */
  async addNewProvider (userId, provider, providerData) {
    const $auth = await sub($.auths[userId])
    await addProviderToAuth($auth, provider, providerData)
  }
}

async function addProviderToAuth (
  $auth,
  provider,
  { providerUserId, privateInfo, publicInfo, raw, token, scopes }
) {
  await $auth[provider].set({ id: providerUserId, ...privateInfo, ...publicInfo, raw, token, scopes })
  const providerIds = $auth.providerIds.get() || []
  if (!providerIds.includes(provider)) await $auth.providerIds.push(provider)
  const userId = $auth.getId()
  // update public info of the user if it's missing
  const $user = await sub($.users[userId])
  if ($user.get()) {
    for (const key in publicInfo) {
      if ($user[key].get() == null && publicInfo[key] != null) await $user[key].set(publicInfo[key])
    }
  } else {
    await $.users[userId].set({ ...publicInfo, createdAt: Date.now() })
  }
}
