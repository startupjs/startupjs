import { Suspense, createElement as el } from 'react'
import { createPlugin } from '@startupjs/registry'
import { Signal } from 'teamplay'
import { maybeRestoreUrl } from '../client/reload.js'
import {
  AUTH_URL,
  AUTH_GET_URL,
  AUTH_FINISH_URL,
  AUTH_PLUGIN_NAME,
  AUTH_LOCAL_PROVIDER,
  AUTH_FORCE_PROVIDER,
  AUTH_2FA_PROVIDER,
  DEFAULT_ENABLED_PROVIDER_IDS
} from '../client/constants.js'
import LocalAuthStorage from './storages/LocalAuthStorage.js'
import apiGetUrl from './api/getUrl.js'
import apiLocalRegister from './api/local/register.js'
import apiLocalLogin from './api/local/login.js'
import apiAppleCallback from './api/apple/callback.js'
import apiProviderCallback from './api/[provider]/callback.js'
import api2faLogin from './api/2fa/login.js'
import apiForceLogin from './api/force/login.js'

export default createPlugin({
  name: AUTH_PLUGIN_NAME,
  order: 'system session',
  enabled () {
    const { enableServer, enableConnection, enableOAuth2 } = this.module.options
    return (enableServer || enableConnection) && enableOAuth2
  },
  isomorphic: ({
    // TODO: atm this option does nothing, make it useful by actually checking enabled providers during auth
    enabledProviderIds = DEFAULT_ENABLED_PROVIDER_IDS
  }) => ({
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
      // TODO: probably move the storage variable up to be a singleton
      const storage = userDBStorage || new LocalAuthStorage(getUsersFilterQueryParams)
      expressApp.post(AUTH_GET_URL,
        apiGetUrl({ providers })
      )
      expressApp.post(`${AUTH_URL}/${AUTH_LOCAL_PROVIDER}/register`,
        apiLocalRegister({ providers, storage, provider: AUTH_LOCAL_PROVIDER })
      )
      expressApp.post(`${AUTH_URL}/${AUTH_LOCAL_PROVIDER}/login`,
        apiLocalLogin({ providers, storage, provider: AUTH_LOCAL_PROVIDER })
      )
      // apple has a magic flow:
      // - it make a POST request to the callback URL and all params are in the body
      // - it sends user data in a magic 'user' field
      // - we are checking the token validity by fetching JWKS and decoding the token
      expressApp.post(`${AUTH_URL}/apple/callback`,
        apiAppleCallback({ providers, storage, provider: 'apple' })
      )
      expressApp.get(`${AUTH_URL}/:provider/callback`,
        apiProviderCallback({ providers, storage })
      )
      expressApp.post(`${AUTH_URL}/${AUTH_2FA_PROVIDER}/login`,
        api2faLogin({ providers, storage, provider: AUTH_2FA_PROVIDER })
      )
      expressApp.get(AUTH_FINISH_URL, (req, res) => {
        res.send('Authenticated successfully')
      })
    },
    afterSession (expressApp) {
      // TODO: probably move the storage variable up to be a singleton
      const storage = userDBStorage || new LocalAuthStorage(getUsersFilterQueryParams)
      // 'Login as...' functionality. Allows to login as another user by his userId.
      // Supposed to be only used by trusted users (e.g. admins).
      expressApp.post(`${AUTH_URL}/${AUTH_FORCE_PROVIDER}/login`,
        apiForceLogin({ providers, storage, provider: AUTH_FORCE_PROVIDER })
      )
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

const maybeRestoreUrlOnce = makeOnceFn(maybeRestoreUrl)
function MaybeRestoreUrl ({ children }) {
  maybeRestoreUrlOnce()
  return children
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
