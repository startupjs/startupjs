import { Suspense, createElement as el } from 'react'
import { axios } from 'startupjs'
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

export default createPlugin({
  name: AUTH_PLUGIN_NAME + '_generic',
  order: 'system session',
  enabled () {
    const { enableServer, enableConnection, enableOAuth2 } = this.module.options
    return (enableServer || enableConnection) && enableOAuth2
  },
  server: ({ 
    providers, 
    getUsersFilterQueryParams = () => ({}),
    /**
     * Find a user by their provider and provider ID
     * @param {string} provider - The authentication provider name (e.g., 'google', 'github', 'local')
     * @param {string} providerId - The unique identifier from the provider
     * @param {Object} filterParams - Additional query parameters for filtering users
     * @returns {Promise<Object|null>} User authentication data object or null if not found
     */
    findUserByProvider = async (provider, providerId, filterParams) => {
      throw new Error('findUserByProvider function must be implemented')
    },
    /**
     * Get a user by their unique user ID
     * @param {string} userId - The unique user identifier
     * @returns {Promise<Object|null>} User object with provider information or null if not found
     */
    getUserById = async (userId) => {
      throw new Error('findAuthByUserId function must be implemented')
    },
    /**
     * Find a user by their email address
     * @param {string} email - The user's email address
     * @param {Object} additionalQuery - Additional MongoDB-style query parameters
     * @returns {Promise<Object|null>} User authentication data object or null if not found
     */
    findUserByEmail = async (email, additionalQuery) => {
      throw new Error('findUserByEmail function must be implemented')
    },
    /**
     * Find a user by their provider secret (used for 2FA authentication)
     * @param {string} provider - The authentication provider name (typically '2fa')
     * @param {string} secret - The secret token or base32 encoded secret
     * @returns {Promise<Object|null>} User authentication data object or null if not found
     */
    findUserBySecret = async (provider, secret) => {
      throw new Error('findUserBySecret function must be implemented')
    },
    /**
     * Create a new user with authentication data
     * @param {Object} authData - User data object containing private info (id, email, etc.) and createdAt timestamp
     * @param {string} authData.id - Unique identifier from the provider
     * @param {string} [authData.email] - User's email address
     * @param {number} authData.createdAt - Timestamp when the user was created
     * @returns {Promise<string>} The newly created user's unique ID
     */
    createUser = async (authData) => {
      throw new Error('createUser function must be implemented')
    },
    /**
     * Add a new authentication provider to an existing user
     * @param {string} userId - The unique user identifier
     * @param {string} provider - The authentication provider name
     * @param {Object} providerData - Provider-specific authentication data
     * @param {string} providerData.providerUserId - The user's ID from the provider
     * @param {Object} providerData.privateInfo - Private user information (id, email)
     * @param {Object} providerData.publicInfo - Public user information (name, avatarUrl)
     * @param {Object} [providerData.raw] - Raw userinfo from provider (if saveRawUserinfo is enabled)
     * @param {string} providerData.token - Access token or hashed password
     * @param {Array<string>} [providerData.scopes] - OAuth scopes granted
     * @returns {Promise<void>}
     */
    addNewProvider = async (userId, provider, providerData) => {
      throw new Error('addNewProvider function must be implemented')
    }
  }) => ({
    beforeSession (expressApp) {
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
            const existingAuth = await findUserByProvider(provider, userinfo.email, getUsersFilterQueryParams())
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
            const token = await bcrypt.hash(userinfo.password, 10)
            delete userinfo.password
            delete userinfo.confirmPassword
            const config = getProviderConfig(providers, provider)
            const state = userinfo.state
            if (state) delete userinfo.state

            const { userId, registered } = await getOrCreateAuth(config, provider, { 
              userinfo, 
              token, 
              getUsersFilterQueryParams,
              findUserByProvider,
              findUserByEmail,
              createUser,
              addNewProvider,
            })
            if (registered) await afterRegister({ config, provider, userId, state })
            await beforeLogin({ config, provider, userId })

            const session = await getSessionData(userId, { getUserById })
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

            const authData = await findUserByProvider(provider, email, getUsersFilterQueryParams())
            const wrongCredentialsError = { error: { message: 'Login or password are incorrect' } }
            if (!authData) return res.json(wrongCredentialsError)
            const token = authData[provider].token
            const passwordMatch = await bcrypt.compare(password, token)
            if (!passwordMatch) return res.json(wrongCredentialsError)
            const config = getProviderConfig(providers, provider)

            await beforeLogin({ config, provider, userId: authData.userId })
            const session = await getSessionData(authData.userId, { getAuthProviderIds })
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
      expressApp.get(`${AUTH_URL}/:provider/callback`, async (req, res) => {
        let provider
        let { state } = req.query
        try { state = JSON.parse(state) } catch (err) {}
        if (typeof state !== 'object') return res.status(400).send('State is invalid')

        try {
          provider = req.params.provider
          const config = getProviderConfig(providers, provider)
          if (!config) return res.status(400).send(`Provider ${provider} is not supported`)
          const { code } = req.query
          if (!code) return res.status(400).send('Code is missing')

          const redirectUri = getRedirectUri(req, provider)
          const accessToken = await getAccessToken(config, provider, { code, redirectUri })
          const userinfo = await getUserinfo(config, provider, { token: accessToken })

          const { userId, registered } = await getOrCreateAuth(config, provider, { 
            userinfo, 
            token: accessToken, 
            getUsersFilterQueryParams,
            findUserByProvider,
            findUserByEmail,
            createUser,
            addNewProvider,
          })

          if (registered) await afterRegister({ config, provider, userId, state })
          await beforeLogin({ config, provider, userId })

          const session = await getSessionData(userId, { getAuthProviderIds })
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

            const authData = await findUserBySecret(provider, secret)
            if (!authData) return res.json({ error: { message: 'Secret is invalid' } })

            const config = getProviderConfig(providers, provider)
            const { verify, duration, numberOfDigits } = config
            const isVerified = await verify({ userId: authData.userId, code, duration, numberOfDigits, getProviderSecret })
            if (!isVerified) return res.json({ error: { message: 'Code is invalid' } })

            await beforeLogin({ config, provider, userId: authData.userId })
            const session = await getSessionData(authData.userId, { getAuthProviderIds })
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
      const provider = AUTH_FORCE_PROVIDER
      expressApp.post(`${AUTH_URL}/${provider}/login`, async (req, res) => {
        try {
          const { userId: targetUserId } = req.body
          if (typeof targetUserId !== 'string') return res.json({ error: { message: 'User ID is required' } })
          const config = getProviderConfig(providers, provider)
          const { validateAccess } = config
          const { session } = req
          if (!session.loggedIn) return res.json({ error: { message: 'You are not logged in' } })
          const targetAuth = await findAuthByUserId(targetUserId)
          if (!targetAuth) return res.json({ error: { message: 'No user found with userId ' + targetUserId } })
          await validateAccess({ session, targetUserId, config, provider, getProviderToken })

          const targetSession = await getSessionData(targetUserId, {
            getAuthProviderIds,
            extraPayload: {
              isImpostor: true,
              impostorUserId: session.userId
            }
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

async function getOrCreateAuth (config, provider, { 
  userinfo, 
  token, 
  getUsersFilterQueryParams,
  findUserByProvider,
  findUserByEmail,
  createUser,
  addNewProvider,
} = {}) {
  const { id: providerUserId, ...privateInfo } = getPrivateInfo(config, userinfo)
  if (!providerUserId) throw Error('auth: did not receive \'id\' from userinfo. You have probably forgot to return the \'id\' field from getPrivateInfo()')
  const publicInfo = getPublicInfo(config, userinfo)
  
  async function updateProviderInfo (userId) {
    const raw = config.saveRawUserinfo ? userinfo : undefined
    await addNewProvider(userId, provider, {
      providerUserId,
      privateInfo,
      publicInfo,
      raw,
      token,
      scopes
    })
  }
  
  // first try to find the exact match with the provider's id
  {
    const authData = await findUserByProvider(provider, providerUserId, getUsersFilterQueryParams())
    if (authData) {
      const { autoUpdateInfo = true } = config
      if (autoUpdateInfo) await updateProviderInfo(authData.userId)
      return { userId: authData.userId, registered: false }
    }
  }
  
  // then see if we already have a user with such email but without this provider
  if (config.allowAutoMergeByEmail && privateInfo.email) {
    const authData = await findUserByEmail(privateInfo.email, {
      [provider]: { $exists: true }, 
      ...getUsersFilterQueryParams()
    })
    if (authData) {
      await updateProviderInfo(authData.userId)
      return { userId: authData.userId, registered: false }
    }
  }
  
  // create a new user
  {
    const userId = await createUser({ ...privateInfo, createdAt: Date.now() })
    await updateProviderInfo(userId)
    return { userId, registered: true }
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

async function beforeLogin ({ config, provider, userId }) {
  if (!config.beforeLogin) return
  const beforeLoginResult = config.beforeLogin({ userId, provider })
  if (beforeLoginResult?.then) await beforeLoginResult
}

async function afterRegister ({ config, provider, userId, state }) {
  if (!config.afterRegister) return
  const afterRegisterResult = config.afterRegister({ userId, provider, state })
  if (afterRegisterResult?.then) await afterRegisterResult
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
  github: {
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userinfoUrl: 'https://api.github.com/user',
    scopes: ['user:email'],
    getPrivateInfo: ({ id, email }) => ({ id, email }),
    getPublicInfo: ({ name, avatar_url }) => ({ name, avatarUrl: avatar_url }),
    allowAutoMergeByEmail: true,
    saveRawUserinfo: true
  },
  local: {
    getPrivateInfo: ({ email }) => ({ id: email, email }),
    getPublicInfo: ({ name }) => ({ name })
  },
  force: {
    async validateAccess ({ session, targetUserId, config, provider }) {
      const clientSecret = await getClientSecret({ config, provider })
      if (!clientSecret) throw new PublicError('Access denied. Secret token is missing')
      const myUserId = session.userId
      const user = await findUserById(myUserId)
      const token = user?.[provider]?.token
      if (token !== clientSecret) throw new PublicError('Access denied. Secret token is invalid')
    }
  },
  '2fa': {
    duration: 60 * 10,
    numberOfDigits: 4,
    async verify ({ userId, code, duration, numberOfDigits }) {
      const user = await findUserById(userId)
      const secret = user?.['2fa']?.base32
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

class PublicError extends Error {
  constructor (...args) {
    super(...args)
    this.public = true
  }
}

// Utility functions
function getPublicError (err, fallback) {
  return err.public ? err.message : fallback
}

function getRedirectUrlFromError (err) {
  return err.redirectUrl
}

async function getSessionData (userId, { getUserById, extraPayload } = {}) {
  const user = await getUserById(userId)
  const authProviderIds = user.providerIds || []
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
  if (!scopes) throw Error(`Scopes are missing for provider ${provider}`)
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
    ])]
  }
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
    if (!decoded) throw Error(`userinfoUrl is missing for provider ${provider}. And the access_token is an opaque token instead of JWT so no user information can be extracted from it.`)
    return decoded
  }
}
