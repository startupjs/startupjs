/**
 * Base class for user database storage operations
 * Can be extended to implement custom database logic
 */
export default class AuthStorage {
  constructor (getUsersFilterQueryParams = () => ({})) {
    this.getUsersFilterQueryParams = getUsersFilterQueryParams
  }

  /**
   * Find a user by their provider and provider ID
   * @param {string} provider - The authentication provider name
   * @param {string} providerId - The unique identifier from the provider
   * @param {Object} filterParams - Additional query parameters for filtering users
   * @returns {Promise<Object|null>} Object with { $auth: scopedModel, auth: userData, userId: string } or null if not found
   */
  async findUserByProvider (provider, providerId, filterParams) {
    throw new Error('findUserByProvider method must be implemented')
  }

  /**
   * Get a user by their unique user ID
   * @param {string} userId - The unique user identifier
   * @returns {Promise<Object|null>} Object with { $auth: scopedModel, auth: userData, userId: string } or null if not found
   */
  async getUserById (userId) {
    throw new Error('getUserById method must be implemented')
  }

  /**
   * Find a user by their email address
   * @param {string} email - The user's email address
   * @param {Object} additionalQuery - Additional query parameters
   * @returns {Promise<Object|null>} Object with { $auth: scopedModel, auth: userData, userId: string } or null if not found
   */
  async findUserByEmail (email, additionalQuery) {
    throw new Error('findUserByEmail method must be implemented')
  }

  /**
   * Find a user by their provider secret (used for 2FA authentication)
   * @param {string} provider - The authentication provider name
   * @param {string} secret - The secret token
   * @returns {Promise<Object|null>} Object with { $auth: scopedModel, auth: userData, userId: string } or null if not found
   */
  async findUserBySecret (provider, secret) {
    throw new Error('findUserBySecret method must be implemented')
  }

  /**
   * Create a new user with authentication data
   * @param {Object} authData - User data object
   * @returns {Promise<Object>} Object with { $auth: scopedModel, auth: userData, userId: string }
   */
  async createUser (authData) {
    throw new Error('createUser method must be implemented')
  }

  /**
   * Add a new authentication provider to an existing user
   * @param {string} userId - The unique user identifier
   * @param {string} provider - The authentication provider name
   * @param {Object} providerData - Provider-specific authentication data
   * @returns {Promise<void>}
   */
  async addNewProvider (userId, provider, providerData) {
    throw new Error('addNewProvider method must be implemented')
  }
}
