import speakeasy from 'speakeasy'
import { PublicError } from './publicError.js'

export const DEFAULT_PROVIDERS = {
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

export function getProviderConfig (providers = {}, provider) {
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

export function getClientSecret ({ config, provider }) {
  const clientSecret = (
    config.getClientSecret?.({ config, provider }) ||
    config.clientSecret ||
    process.env[`${provider.toUpperCase()}_CLIENT_SECRET`]
  )
  if (!clientSecret) throw Error(`Env var ${provider.toUpperCase()}_CLIENT_SECRET is missing`)
  return clientSecret
}

export function getClientId ({ config, provider }) {
  const clientId = (
    config.getClientId?.({ config, provider }) ||
    config.clientId ||
    process.env[`${provider.toUpperCase()}_CLIENT_ID`]
  )
  if (!clientId) throw Error(`Env var ${provider.toUpperCase()}_CLIENT_ID is missing`)
  return clientId
}
