import { axios, $, sub, Signal } from 'startupjs'
import { createPlugin } from '@startupjs/registry'
import createToken from '../utils/createToken.js'

const AUTH_URL = '/auth'
const AUTH_TOKEN_KEY = '__successAuthToken__'

export default createPlugin({
  name: 'auth',
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
  server: ({ providers }) => {
    return {
      beforeSession (expressApp) {
        expressApp.post(`${AUTH_URL}/urls`, (req, res) => {
          try {
            const { providers } = req.body
            if (!Array.isArray(providers)) return res.status(400).send('Providers are missing')
            const urls = {}
            for (const provider of providers) urls[provider] = getAuthUrl(req, provider, providers)
            res.json({ urls })
          } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Error during auth' })
          }
        })
        expressApp.get(`${AUTH_URL}/:provider/callback`, async (req, res) => {
          try {
            const { provider } = req.params
            const config = getProviderConfig(providers, provider)
            if (!config) return res.status(400).send(`Provider ${provider} is not supported`)
            const { code } = req.query
            if (!code) return res.status(400).send('Code is missing')
            const redirectUri = getRedirectUri(req, provider)
            const accessToken = await getAccessToken(config, provider, { code, redirectUri })
            const userinfo = await getUserinfo(config, provider, { token: accessToken })
            console.log('userinfo', userinfo)
            const $auth = await getOrCreateAuth(config, provider, userinfo)
            const userId = $auth.getId()
            const payload = { userId, loggedIn: true }
            const token = await createToken(payload)
            const user = { ...payload, token }
            const userEncoded = encodeURIComponent(JSON.stringify(user))
            res.redirect(`${AUTH_URL}/login?${AUTH_TOKEN_KEY}=${userEncoded}`)
          } catch (err) {
            console.error(err)
            res.status(500).send('Error during auth')
          }
        })
      }
    }
  }
})

function getAuthUrl (req, provider, providers) {
  const config = getProviderConfig(providers, provider)
  if (!config) throw Error(`Provider ${provider} is not supported`)
  const redirectUri = getRedirectUri(req, provider)
  const authUrl = _getAuthUrl(config, provider, { redirectUri })
  return authUrl
}

function getRedirectUri (req, provider) {
  const baseUrl = `${req.protocol}://${req.headers.host}`
  return `${baseUrl}${AUTH_URL}/${provider}/callback`
}

function _getAuthUrl (config, provider, { redirectUri }) {
  const { authUrl } = config
  const clientId = getClientId(config, provider)
  redirectUri = encodeURIComponent(redirectUri)
  let scopes = config.scopes
  if (!scopes) throw Error(`Scopes are missing for provider ${provider}`)
  scopes = encodeURIComponent(config.scopes.join(' '))
  return `${authUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}`
}

async function getAccessToken (config, provider, { redirectUri, code }) {
  const { tokenUrl } = config
  if (!tokenUrl) throw Error(`Token URL is missing for provider ${provider}`)
  const clientId = getClientId(config, provider)
  const clientSecret = getClientSecret(config, provider)
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

function getClientId (config, provider) {
  const clientId = (
    config.getClientId?.() ||
    config.clientId ||
    process.env[`${provider.toUpperCase()}_CLIENT_ID`]
  )
  if (!clientId) throw Error(`Env var ${provider.toUpperCase()}_CLIENT_ID is missing`)
  return clientId
}

function getClientSecret (config, provider) {
  const clientSecret = (
    config.getClientSecret?.() ||
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
  if (!userinfoUrl) throw Error(`Userinfo URL is missing for provider ${provider}`)
  const res = await axios.get(userinfoUrl, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const userinfo = res.data
  if (!userinfo) throw Error(`Userinfo is missing in response from ${userinfoUrl}`)
  return userinfo
}

async function getOrCreateAuth (config, provider, userinfo) {
  const { id: providerUserId, ...privateInfo } = getPrivateInfo(config, userinfo)
  const publicInfo = getPublicInfo(config, userinfo)
  // first try to find the exact match with the provider's id
  {
    const [$auth] = await sub($.auths, { [`${provider}.id`]: providerUserId })
    if ($auth) return $auth
  }
  // then see if we already have a user with such email but without this provider.
  // If the provider is trusted (it definitely provides correct and confirmed email),
  // then we can merge the provider into the existing user.
  if (config.allowAutoMergeByEmail && privateInfo.email) {
    const [$auth] = await sub($.auths, { email: privateInfo.email, [provider]: { $exists: false } })
    if ($auth) {
      await addProviderToAuth($auth, provider, { providerUserId, privateInfo, publicInfo, userinfo })
      return $auth
    }
  }
  // create a new user
  {
    const userId = await $.auths.add({ ...privateInfo, createdAt: Date.now() })
    const $auth = await sub($.auths[userId]) // subscribe to the new user just to keep a reference
    await addProviderToAuth($auth, provider, { providerUserId, privateInfo, publicInfo, userinfo })
    return $auth
  }
}

async function addProviderToAuth ($auth, provider, { providerUserId, privateInfo, publicInfo, userinfo }) {
  await $auth[provider].set({ id: providerUserId, ...privateInfo, ...publicInfo, raw: userinfo })
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

const PROVIDER_IDS = ['google', 'github']
const DEFAULT_PROVIDERS = {
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userinfoUrl: 'https://openidconnect.googleapis.com/v1/userinfo',
    scopes: ['openid', 'profile', 'email'],
    getPrivateInfo: ({ id, email }) => ({ id, email }),
    getPublicInfo: ({ name, picture }) => ({ name, avatarUrl: picture }),
    allowAutoMergeByEmail: true
  },
  github: {
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userinfoUrl: 'https://api.github.com/user',
    scopes: ['user:email'],
    getPrivateInfo: ({ id, email }) => ({ id, email }),
    // eslint-disable-next-line camelcase
    getPublicInfo: ({ name, avatar_url }) => ({ name, avatarUrl: avatar_url }),
    allowAutoMergeByEmail: true
  }
}

function defaultGetPrivateInfo (userinfo) {
  const email = userinfo.email
  const id = userinfo.id || userinfo.email || userinfo.user_id || userinfo.sub
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
