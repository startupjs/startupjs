import { Suspense, createElement as el } from 'react'
import { axios, $, sub, Signal } from 'startupjs'
import { createPlugin } from '@startupjs/registry'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import speakeasy from 'speakeasy'
import { SESSION_KEY } from '../utils/clientSessionData.js'
import createToken from '../utils/createToken.js'
import { maybeRestoreUrl } from '../utils/reload.js'
import {
  AUTH_URL,
  AUTH_TOKEN_KEY,
  AUTH_GET_URL,
  AUTH_FINISH_URL,
  AUTH_PLUGIN_NAME,
  AUTH_LOCAL_PROVIDER,
  AUTH_FORCE_PROVIDER,
  AUTH_2FA_PROVIDER
} from '../utils/constants.js'

/**
 * Base class for user database storage operations
 * Can be extended to implement custom database logic
 */
export class UserDBStorage {
  constructor (getUsersFilterQueryParams = () => ({})) {
    this.getUsersFilterQueryParams = getUsersFilterQueryParams
  }

  /**
   * Find a user by their provider and provider ID
   * @param {string} provider - The authentication provider name
   * @param {string} providerId - The unique identifier from the provider
   * @param {Object} filterParams - Additional query parameters for filtering users
   * @returns {Promise<Object|null>} Object with { auth: userData, $auth?: scopedModel } or null if not found
   */
  async findUserByProvider (provider, providerId, filterParams) {
    throw new Error('findUserByProvider method must be implemented')
  }

  /**
   * Get a user by their unique user ID
   * @param {string} userId - The unique user identifier
   * @returns {Promise<Object|null>} Object with { auth: userData, $auth?: scopedModel } or null if not found
   */
  async getUserById (userId) {
    throw new Error('getUserById method must be implemented')
  }

  /**
   * Find a user by their email address
   * @param {string} email - The user's email address
   * @param {Object} additionalQuery - Additional query parameters
   * @returns {Promise<Object|null>} Object with { auth: userData, $auth?: scopedModel } or null if not found
   */
  async findUserByEmail (email, additionalQuery) {
    throw new Error('findUserByEmail method must be implemented')
  }

  /**
   * Find a user by their provider secret (used for 2FA authentication)
   * @param {string} provider - The authentication provider name
   * @param {string} secret - The secret token
   * @returns {Promise<Object|null>} Object with { auth: userData, $auth?: scopedModel } or null if not found
   */
  async findUserBySecret (provider, secret) {
    throw new Error('findUserBySecret method must be implemented')
  }

  /**
   * Create a new user with authentication data
   * @param {Object} authData - User data object
   * @returns {Promise<Object>} Object with { auth: { userId }, $auth?: scopedModel }
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

/**
 * Local database storage implementation using StartupJS scoped models
 * This maintains the current behavior of the auth plugin
 */
export class LocalDBStorage extends UserDBStorage {
  /**
   * Find a user by their provider and provider ID using StartupJS scoped models
   */
  async findUserByProvider (provider, providerId, filterParams = {}) {
    const [$auth] = await sub($.auths, { [`${provider}.id`]: providerId, ...filterParams })
    if (!$auth?.get()) return null
    return { $auth, auth: { ...$auth.get(), userId: $auth.getId() } }
  }

  /**
   * Get a user by their unique user ID using StartupJS scoped models
   */
  async getUserById (userId) {
    const $auth = await sub($.auths[userId])
    if (!$auth?.get()) return null
    return { $auth, auth: { ...$auth.get(), userId: $auth.getId() } }
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
    return { $auth, auth: { ...$auth.get(), userId: $auth.getId() } }
  }

  /**
   * Find a user by their provider secret using StartupJS scoped models
   */
  async findUserBySecret (provider, secret) {
    const [$auth] = await sub($.auths, { [`${provider}.secret`]: secret })
    if (!$auth?.get()) return null
    return { $auth, auth: { ...$auth.get(), userId: $auth.getId() } }
  }

  /**
   * Create a new user using StartupJS scoped models
   */
  async createUser (authData) {
    const userId = await $.auths.add({ ...authData, createdAt: Date.now() })
    const $auth = await sub($.auths[userId])
    return { $auth, auth: { ...$auth.get(), userId } }
  }

  /**
   * Add a new authentication provider to an existing user using StartupJS scoped models
   */
  async addNewProvider (userId, provider, providerData) {
    const $auth = await sub($.auths[userId])
    await addProviderToAuth($auth, provider, providerData)
  }
}

export default createPlugin({
  name: AUTH_PLUGIN_NAME,
  order: 'system session',
  enabled () {
    const { enableServer, enableConnection, enableOAuth2 } = this.module.options
    return (enableServer || enableConnection) && enableOAuth2
  },
  isomorphic: ({ enabledProviderIds = PROVIDER_IDS }) => ({
    models: models => {
      return {
        ...models,
        auths: {
          default: Signal,
          ...models.auths,
          schema: {
            ...getAuthsSchema(enabledProviderIds),
            ...models.auths?.schema
          }
        },
        users: {
          default: Signal,
          ...models.users,
          schema: {
            ...getUsersSchema(),
            ...models.users?.schema
          }
        }
      }
    }
  }),
  server: ({ providers, getUsersFilterQueryParams = () => ({}), userDBStorage }) => ({
    beforeSession (expressApp) {
      const storage = userDBStorage || new LocalDBStorage(getUsersFilterQueryParams)
      expressApp.post(AUTH_GET_URL, (req, res) => {
        try {
          const { provider, extraScopes } = req.body
          if (!provider) return res.status(400).send('Provider is not specified')
          const url = getAuthUrl(req, provider, providers, { extraScopes })
          res.json({ url })
        } catch (err) {
          console.error(err)
          res.status(500).json({ error: 'Error during auth' })
        }
      })
      {
        const provider = AUTH_LOCAL_PROVIDER
        expressApp.post(`${AUTH_URL}/${provider}/register`, async (req, res) => {
          try {
            const userinfo = JSON.parse(JSON.stringify(req.body || {}))
            if (!(typeof userinfo?.email === 'string' && typeof userinfo?.password === 'string')) {
              return res.json({ error: { message: 'Email and password are required' } })
            }
            userinfo.email = userinfo.email.trim().toLowerCase()
            userinfo.password = userinfo.password.trim()
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userinfo.email)) {
              return res.json({ error: { message: 'Email is invalid' } })
            }
            const existingAuth = await storage.findUserByProvider(provider, userinfo.email, storage.getUsersFilterQueryParams())
            if (existingAuth) return res.json({ error: { message: 'User with this email already exists' } })
            if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(userinfo.password)) {
              return res.json({
                error: {
                  message: 'Password has to be at least 8 characters long and ' +
                    'contain at least one number, one lowercase and one uppercase letter'
                }
              })
            }
            if (typeof userinfo.confirmPassword === 'string') {
              userinfo.confirmPassword = userinfo.confirmPassword.trim()
              if (userinfo.password !== userinfo.confirmPassword) {
                return res.json({ error: { message: 'Confirm password does not match' } })
              }
            }
            const token = await bcrypt.hash(userinfo.password, 10) // hash password before saving
            delete userinfo.password
            delete userinfo.confirmPassword
            const config = getProviderConfig(providers, provider)
            const state = userinfo.state
            if (state) delete userinfo.state

            const { userId, registered, $auth } = await getOrCreateAuth(config, provider, { userinfo, token, storage })
            // run hooks
            if (registered) await afterRegister({ $auth, config, provider, userId, state })
            await beforeLogin({ $auth, config, provider, userId })

            // login
            const session = await getSessionData(userId, { storage })
            res.json({ session })
          } catch (err) {
            console.warn(`User auth error (${provider}) register:`, err)
            const redirectUrl = getRedirectUrlFromError(err)

            if (redirectUrl) return res.json({ error: { redirectUrl } })

            const publicError = getPublicError(err, 'Error during registration. Please try again later')
            res.json({ error: { message: publicError } })
          }
        })
        expressApp.post(`${AUTH_URL}/${provider}/login`, async (req, res) => {
          try {
            let { email, password } = req.body || {}
            if (!(typeof email === 'string' && typeof password === 'string')) {
              return res.json({ error: { message: 'Email and password are required' } })
            }
            email = email.trim().toLowerCase()
            password = password.trim()
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
              return res.json({ error: { message: 'Email is invalid' } })
            }

            const user = await storage.findUserByProvider(provider, email, storage.getUsersFilterQueryParams())
            const wrongCredentialsError = { error: { message: 'Login or password are incorrect' } }
            if (!user) return res.json(wrongCredentialsError)
            const token = user.auth[provider].token
            const passwordMatch = await bcrypt.compare(password, token)
            if (!passwordMatch) return res.json(wrongCredentialsError)
            const config = getProviderConfig(providers, provider)

            // run hooks
            await beforeLogin({ $auth: user.$auth, config, provider, userId: user.auth.userId })

            // login
            const session = await getSessionData(user.auth.userId, { storage })
            res.json({ session })
          } catch (err) {
            console.warn(`User auth error (${provider}) login:`, err)
            const redirectUrl = getRedirectUrlFromError(err)

            if (redirectUrl) return res.json({ error: { redirectUrl } })

            const publicError = getPublicError(err, 'Error during login. Please try again later.')
            res.json({ error: { message: publicError } })
          }
        })
      }
      {
        // apple has a magic flow:
        // - it make a POST request to the callback URL and all params are in the body
        // - it sends user data in a magic 'user' field
        // - we are checking the token validity by fetching JWKS and decoding the token
        const provider = 'apple'
        expressApp.post(`${AUTH_URL}/${provider}/callback`, async (req, res) => {
          // get the passed state
          let { state } = req.body
          if (typeof state === 'string') state = JSON.parse(state)
          if (typeof state !== 'object') return res.status(400).send('State is invalid')

          try {
            const config = getProviderConfig(providers, provider)
            if (!config) return res.status(400).send(`Provider ${provider} is not supported`)
            const { id_token: idToken } = req.body
            if (!idToken) return res.status(400).send('Id token is missing')

            // validate the idToken
            const { jwksUrl } = config
            if (!jwksUrl) return res.status(400).send('jwksUrl is not set in config')
            const client = jwksClient({ jwksUri: jwksUrl, timeout: 30000 })
            const { header: { kid } } = jwt.decode(idToken, { complete: true })
            const publicKey = (await client.getSigningKey(kid)).getPublicKey()
            const { sub, email } = jwt.verify(idToken, publicKey)

            // assemble userinfo
            // NOTE: apple sends the name in the magic 'user' field
            let { user } = req.body
            if (typeof user === 'string') user = JSON.parse(user)
            const userinfo = { sub, email, user }

            // get or create user
            // NOTE: apple only provides the user info on initial login, so we never actually "update" it
            const { scopes } = state
            if (!Array.isArray(scopes)) return res.status(400).send('Returned scopes are invalid')
            const { userId, registered, $auth } = await getOrCreateAuth(config, provider, { userinfo, scopes, storage })

            // run hooks
            if (registered) await afterRegister({ $auth, config, provider, userId, state })
            await beforeLogin({ $auth, config, provider, userId })

            // login
            const session = await getSessionData(userId, { storage })
            redirectBackToApp(res, session, state)
          } catch (err) {
            console.warn(`User auth error (${provider}):`, err)
            const redirectUrl = getRedirectUrlFromError(err)

            if (redirectUrl) {
              return redirectBackToAppError({ res, err: { redirectUrl }, state })
            }

            const publicError = getPublicError(err, 'Error during auth. Please try again later')
            redirectBackToAppError({ res, err: { message: publicError }, state })
          }
        })
      }
      expressApp.get(`${AUTH_URL}/:provider/callback`, async (req, res) => {
        let provider
        // get the passed state
        let { state } = req.query
        try { state = JSON.parse(state) } catch (err) {}
        if (typeof state !== 'object') return res.status(400).send('State is invalid')

        try {
          provider = req.params.provider
          const config = getProviderConfig(providers, provider)
          if (!config) return res.status(400).send(`Provider ${provider} is not supported`)
          const { code } = req.query
          if (!code) return res.status(400).send('Code is missing')

          // get the passed state
          let { state } = req.query
          try { state = JSON.parse(state) } catch (err) {}
          if (typeof state !== 'object') return res.status(400).send('State is invalid')

          // get userinfo
          const redirectUri = getRedirectUri(req, provider)
          const accessToken = await getAccessToken(config, provider, { code, redirectUri })
          const userinfo = await getUserinfo(config, provider, { token: accessToken })

          // update or create user
          const { scopes } = state
          if (!Array.isArray(scopes)) return res.status(400).send('Returned scopes are invalid')
          const { userId, registered, $auth } = await getOrCreateAuth(config, provider, { userinfo, token: accessToken, scopes, storage })

          // run hooks
          if (registered) await afterRegister({ $auth, config, provider, userId, state })
          await beforeLogin({ $auth, config, provider, userId })

          // login
          const session = await getSessionData(userId, { storage })
          redirectBackToApp(res, session, state)
        } catch (err) {
          console.warn(`User auth error (${provider}):`, err)
          const redirectUrl = getRedirectUrlFromError(err)

          if (redirectUrl) {
            return redirectBackToAppError({ res, err: { redirectUrl }, state })
          }

          const publicError = getPublicError(err, 'Error during auth. Please try again later')
          redirectBackToAppError({ res, err: { message: publicError }, state })
        }
      })
      {
        const provider = AUTH_2FA_PROVIDER
        expressApp.post(`${AUTH_URL}/${provider}/login`, async (req, res) => {
          try {
            const { secret, code } = req.body
            if (!secret) return res.status(400).send('Secret is missing')
            if (!code) return res.status(400).send('Code is missing')

            const user = await storage.findUserBySecret(provider, secret)
            if (!user) return res.json({ error: { message: 'Secret is invalid' } })

            const config = getProviderConfig(providers, provider)
            const { verify, duration, numberOfDigits } = config
            const { $auth, auth } = user
            const isVerified = await verify({ userId: auth.userId, code, duration, numberOfDigits, storage })
            if (!isVerified) return res.json({ error: { message: 'Code is invalid' } })

            // run hooks
            await beforeLogin({ $auth, config, provider, userId: auth.userId })

            // login
            const session = await getSessionData(auth.userId, { storage })
            res.json({ session })
          } catch (err) {
            console.warn(`User auth error (${provider}):`, err)

            const publicError = getPublicError(err, 'Error during login. Please try again later.')
            res.json({ error: { message: publicError } })
          }
        })
      }
      expressApp.get(AUTH_FINISH_URL, (req, res) => {
        res.send('Authenticated successfully')
      })
    },
    afterSession (expressApp) {
      const storage = userDBStorage || new LocalDBStorage(getUsersFilterQueryParams)
      const provider = AUTH_FORCE_PROVIDER
      // 'Login as...' functionality. Allows to login as another user by his userId.
      // Supposed to be only used by trusted users (e.g. admins).
      expressApp.post(`${AUTH_URL}/${provider}/login`, async (req, res) => {
        try {
          const { userId: targetUserId } = req.body
          if (typeof targetUserId !== 'string') return res.json({ error: { message: 'User ID is required' } })
          const config = getProviderConfig(providers, provider)
          const { validateAccess } = config
          const { session } = req
          if (!session.loggedIn) return res.json({ error: { message: 'You are not logged in' } })
          const targetAuthData = await storage.getUserById(targetUserId)
          if (!targetAuthData) return res.json({ error: { message: 'No user found with userId ' + targetUserId } })
          await validateAccess({ session, targetUserId, config, provider, storage })

          // login
          const targetSession = await getSessionData(targetUserId, {
            extraPayload: {
              isImpostor: true,
              impostorUserId: session.userId
            },
            storage
          })
          res.json({ session: targetSession })
        } catch (err) {
          console.warn(`User auth error (${provider}):`, err)
          const redirectUrl = getRedirectUrlFromError(err)

          if (redirectUrl) return res.json({ error: { redirectUrl } })

          const publicError = getPublicError(err, 'Error during login. Please try again later.')
          res.json({ error: { message: publicError } })
        }
      })
    }
  }),
  client: () => ({
    renderRoot ({ children }) {
      return (
        el(Suspense, { fallback: null },
          el(MaybeRestoreUrl, {},
            children
          )
        )
      )
    }
  })
})

function getPublicError (err, fallback) {
  return err.public ? err.message : fallback
}

function getRedirectUrlFromError (err) {
  return err.redirectUrl
}

const maybeRestoreUrlOnce = makeOnceFn(maybeRestoreUrl)
function MaybeRestoreUrl ({ children }) {
  maybeRestoreUrlOnce()
  return children
}

function redirectBackToApp (res, session, { redirectUrl, platform }) {
  if (!redirectUrl) throw Error('Redirect URL is missing. It must be passed in the state from the client')
  if (platform === 'web') {
    res.setHeader('Content-Type', 'text/html')
    res.send(`
      <script>
        localStorage.setItem('${SESSION_KEY}', '${JSON.stringify(session)}');
        window.location.href = '${redirectUrl || '/'}';
      </script>
    `)
  } else {
    const sessionEncoded = encodeURIComponent(JSON.stringify(session))
    res.redirect(`${redirectUrl}?${AUTH_TOKEN_KEY}=${sessionEncoded}`)
  }
}

function redirectBackToAppError ({ res, err, state }) {
  const { redirectUrl, platform } = state

  if (!redirectUrl) {
    throw new Error('Redirect URL is missing. It must be passed in the state from the client')
  }
  const { redirectUrl: errRedirectUrl, message } = err

  if (platform === 'web') {
    let href = errRedirectUrl || redirectUrl
    if (message) href += `?err=${encodeURIComponent(JSON.stringify({ message }))}`
    res.setHeader('Content-Type', 'text/html')
    res.send(`
      <script>
        window.location.href = '${href}';
      </script>
    `)
  } else {
    const errEncoded = encodeURIComponent(JSON.stringify(err))
    res.redirect(`${redirectUrl}?err=${errEncoded}`)
  }
}

async function getSessionData (userId, { extraPayload, storage } = {}) {
  const user = await storage.getUserById(userId)
  const { auth } = user
  const authProviderIds = auth?.providerIds || []
  const payload = { userId, loggedIn: true, authProviderIds, ...extraPayload }
  const token = await createToken(payload)
  return { ...payload, token }
}

function getAuthUrl (req, provider, providers, { extraScopes } = {}) {
  const config = getProviderConfig(providers, provider)
  if (!config) throw Error(`Provider ${provider} is not supported`)
  const redirectUri = getRedirectUri(req, provider)
  return _getAuthUrl(config, provider, { redirectUri, extraScopes })
}

function getRedirectUri (req, provider) {
  let host = req.headers.host
  const port = host.split(':')[1]
  // hack for local development of expo app.
  // When opening app in iOS emulator it uses the local IP address as a BASE_URL
  // instead of localhost. Which is a problem because the auth callback URL
  // expects 'localhost' as a host. So we need to replace the IP address with 'localhost'.
  if (/192\.168\./.test(host) || /10\./.test(host)) {
    host = 'localhost'
    host += port ? `:${port}` : ''
  }
  const baseUrl = `${req.protocol}://${host}`
  return `${baseUrl}${AUTH_URL}/${provider}/callback`
}

function _getAuthUrl (config, provider, { redirectUri, extraScopes = [] }) {
  const { authUrl } = config
  const clientId = getClientId({ config, provider })
  let { scopes, authUrlSearchParams } = config
  if (!scopes) throw Error(ERRORS.missingScopes(provider))
  scopes = [...new Set([...scopes, ...extraScopes])]
  const params = new URLSearchParams(Object.entries({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes.join(' '),
    ...authUrlSearchParams
  })).toString()
  return `${authUrl}?${params}`
}

async function getAccessToken (config, provider, { redirectUri, code }) {
  const { tokenUrl } = config
  if (!tokenUrl) throw Error(`Token URL is missing for provider ${provider}`)
  const clientId = getClientId({ config, provider })
  const clientSecret = getClientSecret({ config, provider })
  const res = await axios.post(tokenUrl, {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code'
  })
  let token
  if (typeof res.data === 'string') {
    if (res.data.startsWith('error=')) throw Error(`Error response from ${tokenUrl}: ${res.data}`)
    const params = new URLSearchParams(res.data)
    token = params.get('access_token')
  } else if (typeof res.data === 'object') {
    token = res.data.access_token
  } else {
    throw Error(`Unexpected response from ${tokenUrl}`)
  }
  if (!token) throw Error(`Token is missing in response from ${tokenUrl}`)
  return token
}

function getClientId ({ config, provider }) {
  const clientId = (
    config.getClientId?.({ config, provider }) ||
    config.clientId ||
    process.env[`${provider.toUpperCase()}_CLIENT_ID`]
  )
  if (!clientId) throw Error(`Env var ${provider.toUpperCase()}_CLIENT_ID is missing`)
  return clientId
}

function getClientSecret ({ config, provider }) {
  const clientSecret = (
    config.getClientSecret?.({ config, provider }) ||
    config.clientSecret ||
    process.env[`${provider.toUpperCase()}_CLIENT_SECRET`]
  )
  if (!clientSecret) throw Error(`Env var ${provider.toUpperCase()}_CLIENT_SECRET is missing`)
  return clientSecret
}

function getProviderConfig (providers = {}, provider) {
  if (!(providers[provider] || DEFAULT_PROVIDERS[provider])) return undefined
  return {
    ...DEFAULT_PROVIDERS[provider],
    ...providers[provider],
    scopes: [...new Set([
      ...(DEFAULT_PROVIDERS[provider]?.scopes || []),
      ...(providers[provider]?.scopes || [])
    ])] // merge default scopes with additional custom scopes
  }
}

async function getUserinfo (config, provider, { token }) {
  const { userinfoUrl } = config
  if (userinfoUrl) {
    const res = await axios.get(userinfoUrl, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const userinfo = res.data
    if (!userinfo) throw Error(`Userinfo is missing in response from ${userinfoUrl}`)
    return userinfo
  } else {
    const decoded = jwt.decode(token)
    if (!decoded) throw Error(ERRORS.missingUserinfoUrl(provider))
    return decoded
  }
}

async function getOrCreateAuth (config, provider, { userinfo, token, scopes, storage } = {}) {
  const { id: providerUserId, ...privateInfo } = getPrivateInfo(config, userinfo)
  if (!providerUserId) throw Error(ERRORS.noIdField)
  const publicInfo = getPublicInfo(config, userinfo)
  async function updateProviderInfo (userId) {
    const raw = config.saveRawUserinfo ? userinfo : undefined
    await storage.addNewProvider(userId, provider, { providerUserId, privateInfo, publicInfo, raw, token, scopes })
  }
  // first try to find the exact match with the provider's id
  {
    const user = await storage.findUserByProvider(provider, providerUserId, storage.getUsersFilterQueryParams())
    // update user info if it was changed
    if (user) {
      const { auth, $auth } = user
      const { autoUpdateInfo = true } = config
      if (autoUpdateInfo) await updateProviderInfo(auth.userId)
      return { $auth, userId: auth.userId, registered: false }
    }
  }
  // then see if we already have a user with such email but without this provider.
  // If the provider is trusted (it definitely provides correct and confirmed email),
  // then we can merge the provider into the existing user.
  if (config.allowAutoMergeByEmail && privateInfo.email) {
    const user = await storage.findUserByEmail(privateInfo.email, {
      [provider]: { $exists: false },
      ...storage.getUsersFilterQueryParams()
    })
    if (user) {
      const { auth, $auth } = user
      await updateProviderInfo(auth.userId)
      return { $auth, userId: auth.userId, registered: false }
    }
  }
  // create a new user
  {
    const { $auth, auth } = await storage.createUser({ ...privateInfo })
    await updateProviderInfo(auth.userId)
    return { $auth, userId: auth.userId, registered: true }
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

function getPrivateInfo (config, userinfo) {
  const privateInfo = config.getPrivateInfo?.(userinfo) || defaultGetPrivateInfo(userinfo)
  if (!privateInfo?.id) throw Error('Userinfo: id is missing')
  return privateInfo
}

function getPublicInfo (config, userinfo) {
  return config.getPublicInfo?.(userinfo) || defaultGetPublicInfo(userinfo)
}

async function beforeLogin ({ $auth, config, provider, userId }) {
  if (!config.beforeLogin) return

  const beforeLoginResult = config.beforeLogin({ $auth, userId, provider })
  if (beforeLoginResult?.then) await beforeLoginResult
}

async function afterRegister ({ $auth, config, provider, userId, state }) {
  if (!config.afterRegister) return

  const afterRegisterResult = config.afterRegister({ $auth, userId, provider, state })
  if (afterRegisterResult?.then) await afterRegisterResult
}

const PROVIDER_IDS = ['google', 'github']
const DEFAULT_PROVIDERS = {
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userinfoUrl: 'https://openidconnect.googleapis.com/v1/userinfo',
    scopes: ['openid', 'profile', 'email'],
    getPrivateInfo: ({ sub, email }) => ({ id: sub, email }),
    getPublicInfo: ({ name, picture }) => ({ name, avatarUrl: picture }),
    allowAutoMergeByEmail: true,
    saveRawUserinfo: true
  },
  apple: {
    authUrl: 'https://appleid.apple.com/auth/authorize',
    jwksUrl: 'https://appleid.apple.com/auth/keys',
    scopes: ['name', 'email'],
    getPrivateInfo: ({ sub, email }) => ({ id: sub, email }),
    getPublicInfo: ({ user }) => {
      const res = {}
      const name = `${user?.name?.firstName || ''} ${user?.name?.lastName || ''}`.trim()
      if (name) res.name = name
      return res
    },
    authUrlSearchParams: {
      response_mode: 'form_post',
      response_type: 'code id_token'
    },
    autoUpdateInfo: false
  },
  github: {
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userinfoUrl: 'https://api.github.com/user',
    scopes: ['user:email'],
    getPrivateInfo: ({ id, email }) => ({ id, email }),
    // eslint-disable-next-line camelcase
    getPublicInfo: ({ name, avatar_url }) => ({ name, avatarUrl: avatar_url }),
    allowAutoMergeByEmail: true,
    saveRawUserinfo: true
  },
  local: {
    getPrivateInfo: ({ email }) => ({ id: email, email }),
    getPublicInfo: ({ name }) => ({ name })
  },
  force: {
    async validateAccess ({ session, targetUserId, config, provider, storage }) {
      // By default a very simple check is used to validate access to this feature.
      // `auths[userId].force.token` should match `process.env.FORCE_CLIENT_SECRET`.
      // If env var doesn't exist, this feature is disabled.
      // In production app you should implement a more secure way to validate admin access
      const clientSecret = await getClientSecret({ config, provider })
      if (!clientSecret) throw new PublicError('Access denied. Secret token is missing')
      const myUserId = session.userId
      const user = await storage.getUserById(myUserId)
      const token = user.auth[provider].token
      if (token !== clientSecret) throw new PublicError('Access denied. Secret token is invalid')
    }
  },
  '2fa': {
    duration: 60 * 10, // 10 minutes
    numberOfDigits: 4,
    async verify ({ userId, code, duration, numberOfDigits, storage }) {
      const user = await storage.getUserById(userId)
      const secret = user.auth['2fa'].base32

      return speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token: code,
        step: duration,
        digits: numberOfDigits,
        window: 1
      })
    }
  }
}

function defaultGetPrivateInfo (userinfo) {
  const email = userinfo.email
  const id = userinfo.id || userinfo.sub || userinfo.user_id || userinfo.email || userinfo.login
  return { id, email }
}

function defaultGetPublicInfo (userinfo) {
  const name = userinfo.displayName || userinfo.name || userinfo.nickname || userinfo.username || userinfo.login
  const potentialAvatarKeys = [
    'avatarUrl', 'avatar_url', 'avatarURL', 'avatar', 'photoUrl', 'photo_url', 'photoURL', 'photo',
    'pictureUrl', 'picture_url', 'pictureURL', 'picture', 'image', 'imageUrl', 'image_url', 'imageURL'
  ]
  let avatarUrl
  for (const key of potentialAvatarKeys) {
    if (userinfo[key]) {
      avatarUrl = userinfo[key]
      break
    }
  }
  return { name, avatarUrl }
}

export function getAuthsSchema (enabledProviderIds) {
  return {
    email: { type: 'string' },
    createdAt: { type: 'number', required: true },
    ...enabledProviderIds.reduce((acc, providerId) => ({
      ...acc,
      [providerId]: {
        id: { type: 'string', required: true },
        email: { type: 'string' },
        name: { type: 'string' },
        avatarUrl: { type: 'string' },
        raw: { type: 'object' }
      }
    }), {})
  }
}

export function getUsersSchema () {
  return {
    name: { type: 'string' },
    avatarUrl: { type: 'string' },
    createdAt: { type: 'number', required: true }
  }
}

function makeOnceFn (fn) {
  let promise, initialized, error, result
  return (...args) => {
    if (initialized) return result
    if (error) throw error
    if (promise) return promise
    promise = (async () => {
      try {
        const resultOrPromise = fn(...args)
        if (resultOrPromise?.then) result = await resultOrPromise
        else result = resultOrPromise
        initialized = true
        return result
      } catch (err) {
        error = err
      } finally {
        promise = undefined
      }
    })()
    if (initialized) return result // in case of sync result
    return promise
  }
}

class PublicError extends Error {
  constructor (...args) {
    super(...args)
    this.public = true
  }
}

const ERRORS = {
  missingUserinfoUrl: provider => `
    \`userinfoUrl\` is missing for provider ${provider}.
    And the access_token is an opaque token instead of JWT so no user information can be extracted from it.
  `,
  missingScopes: provider => `Scopes are missing for provider ${provider}`,
  noIdField: `
    auth: did not receive 'id' from userinfo.
    You have probably forgot to return the 'id' field from getPrivateInfo()
  `
}
