import { Suspense, createElement as el } from 'react'
import { axios } from 'startupjs'
import { createPlugin } from '@startupjs/registry'
import isDevelopment from '@startupjs/utils/isDevelopment'
import { BASE_URL, setBaseUrl } from '@startupjs/utils/BASE_URL'
import connect from 'teamplay/connect'
import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'
import getAppSecret from '../utils/getAppSecret.js'
import createToken, { TOKEN_REISSUE_AFTER_SECONDS } from '../utils/createToken.js'
import { setSessionData, getSessionData } from '../utils/clientSessionData.js'

const URL_ANONYMOUS_TOKEN = '/api/auth/token'
const NOT_CHANGED_KEY = '__NOT_CHANGED__'

export default createPlugin({
  name: 'oauth2',
  order: 'system session',
  enabled () {
    const { enableServer, enableConnection, enableOAuth2 } = this.module.options
    return (enableServer || enableConnection) && enableOAuth2
  },
  server: () => ({
    beforeSession (expressApp) {
      expressApp.post(URL_ANONYMOUS_TOKEN, async (req, res) => {
        let { token } = req.body
        const appSecret = await getAppSecret()
        if (token) {
          try {
            const { iat } = jwt.verify(token, appSecret)
            // check if token is about to expire and force reissue it with same session data
            const currentTimeInSeconds = Math.floor(Date.now() / 1000)
            const expiredAt = iat + TOKEN_REISSUE_AFTER_SECONDS
            if (currentTimeInSeconds > expiredAt) {
              throw new jwt.TokenExpiredError('Token is about to expire, must reissue', expiredAt)
            }
            // token is valid and not expired
            return res.json({ [NOT_CHANGED_KEY]: true })
          } catch (err) {
            if (err.name === 'TokenExpiredError') {
              // reissue token if it's expired
              try {
                const { iat, exp, ...session } = jwt.verify(token, appSecret, { ignoreExpiration: true })
                token = await createToken(session)
                return res.json({ ...session, token })
              } catch (err) {}
            }
          }
        }
        const userId = uuid()
        token = await createToken({ userId })
        return res.json({ userId, token })
      })
    },
    session (expressApp) {
      expressApp.use(async (req, res, next) => {
        const token = req.headers.authorization?.split('Bearer ')[1]
        if (!token) return next()
        try {
          req.session = jwt.verify(token, await getAppSecret())
          next()
        } catch (err) {
          return res.status(401).send(ERRORS.noValidToken + '\n' + err.message)
        }
      })
    },
    authorizeConnection (next) {
      return async function authorizeToken (req) {
        const query = req.url.split('?')[1] || ''
        const token = new URLSearchParams(query).get('token')
        if (!token) throw Error('No token found in connection URL')
        req.session = jwt.verify(token, await getAppSecret())
        await next?.(req)
      }
    }
  }),
  client: (options, {
    module: {
      options: { baseUrl = BASE_URL, enableXhrFallback = true }
    }
  }) => {
    if (baseUrl !== BASE_URL) setBaseUrl(baseUrl)
    axios.defaults.baseURL = baseUrl
    return {
      renderRoot ({ children }) {
        return (
          el(Suspense, { fallback: null },
            el(TokenInitializer, {},
              el(ConnectionInitializer, { baseUrl, enableXhrFallback },
                children
              )
            )
          )
        )
      }
    }
  }
})

function TokenInitializer ({ children }) {
  const promise = initTokenOnce()
  if (promise instanceof Promise) throw promise
  return children
}

const initTokenOnce = makeOnceFn(initToken)
async function initToken () {
  let session = await getSessionData()
  const res = await axios.post(URL_ANONYMOUS_TOKEN, { token: session?.token })
  // TODO: handle errors like 500 etc.
  if (!res.data?.[NOT_CHANGED_KEY]) session = res.data
  await setSessionData(session)
}

function ConnectionInitializer ({ baseUrl, enableXhrFallback, children }) {
  const promise = initConnectionOnce({ baseUrl, enableXhrFallback })
  if (promise instanceof Promise) throw promise
  return children
}

const initConnectionOnce = makeOnceFn(initConnection)
async function initConnection ({ baseUrl, enableXhrFallback }) {
  const { token } = await getSessionData() || {}
  if (!token) throw Error('No authorization token found in session data')
  connect({
    baseUrl,
    getConnectionUrl,
    // In dev we embed startupjs server as middleware into Metro server itself.
    // We have to use XHR since there is no way to easily access Metro's WebSocket endpoints.
    // In production we run our own server and can use WebSocket without any problems.
    forceXhrFallback: enableXhrFallback && isDevelopment
  })
  function getConnectionUrl ({ getDefaultConnectionUrl }) {
    return getDefaultConnectionUrl() + '?token=' + token
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

const ERRORS = {
  noValidToken: 'Unauthorized. Error while checking token:'
}
