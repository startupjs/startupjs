import { Suspense, createElement as el } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { axios, $ } from 'startupjs'
import { createPlugin } from '@startupjs/registry'
import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'
import getAppSecret from '../utils/getAppSecret.js'

const URL_ANONYMOUS_TOKEN = '/api/auth/anonymous/token'
const USER_KEY = 'startupjs.user'
const TOKEN_EXPIRATION = '1d'
const NOT_CHANGED_KEY = '__NOT_CHANGED__'

export default createPlugin({
  name: 'oauth2',
  order: 'system session',
  enabled () {
    const { enableServer, enableConnection, enableOAuth2 } = this.module.options
    return (enableServer || enableConnection) && enableOAuth2
  },
  server: () => {
    return {
      beforeSession (expressApp) {
        expressApp.post(URL_ANONYMOUS_TOKEN, async (req, res) => {
          let { token } = req.body
          const appSecret = await getAppSecret()
          if (token) {
            try {
              jwt.verify(token, appSecret)
              return res.json({ [NOT_CHANGED_KEY]: true })
            } catch (err) {}
          }
          const userId = uuid()
          token = jwt.sign(
            { userId },
            appSecret,
            { algorithm: 'HS256', expiresIn: TOKEN_EXPIRATION }
          )
          return res.json({ userId, token })
        })
      },
      session (expressApp) {
        expressApp.use(async (req, res, next) => {
          const token = req.headers.authorization?.split('Bearer ')[1]
          if (!token) return next()
          try {
            req.user = jwt.verify(token, await getAppSecret())
            next()
          } catch (err) {
            return res.status(401).send(ERRORS.noValidToken + '\n' + err.message)
          }
        })
      }
    }
  },
  client: () => ({
    renderRoot ({ children }) {
      return (
        el(Suspense, { fallback: null },
          el(TokenInitializer, {}, children)
        )
      )
    }
  })
})

function TokenInitializer ({ children }) {
  const promise = initTokenOnce()
  if (promise) throw promise
  return children
}

const initTokenOnce = makeOnceFn(initToken)

async function initToken () {
  let user = await AsyncStorage.getItem(USER_KEY)
  user = user != null ? JSON.parse(user) : undefined
  const res = await axios.post(URL_ANONYMOUS_TOKEN, { token: user?.token })
  // TODO: handle errors like 500 etc.
  if (!res.data?.[NOT_CHANGED_KEY]) {
    user = res.data
    validateUser(user)
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user))
  }
  const { token, userId, ...other } = user
  $.session.userId.set(userId)
  $.session.token.set(token)
  for (const key in other) $.session[key].set(other[key])
  axios.defaults.headers.common.Authorization = 'Bearer ' + token
  await emitInitUser(user)
}

function validateUser (user) {
  if (!user) throw Error(ERRORS.jwtNoUserinfo(user))
  if (!user.userId) throw Error(ERRORS.jwtNoUserId(user))
  if (!user.token) throw Error(ERRORS.jwtNoToken(user))
}

function makeOnceFn (fn) {
  let promise, initialized, error
  return (...args) => {
    if (initialized) return
    if (error) throw error
    if (promise) return promise
    promise = (async () => {
      try {
        await fn(...args)
        initialized = true
      } catch (err) {
        error = err
      } finally {
        promise = undefined
      }
    })()
    return promise
  }
}

const onInitUserHandlers = new Set()
export function onInitUser (cb) { onInitUserHandlers.add(cb) }
async function emitInitUser (user) {
  for (const handler of onInitUserHandlers) {
    const promise = handler(user)
    if (promise?.then) await promise
  }
}

const ERRORS = {
  jwtNoUserinfo: userinfo => `Invalid jwt request. Did not get user info from server. Got: ${JSON.stringify(userinfo)}`,
  jwtNoUserId: userinfo => `Invalid jwt request. Missing userId. Got: ${JSON.stringify(userinfo)}`,
  jwtNoToken: userinfo => `Invalid jwt request. Missing token. Got: ${JSON.stringify(userinfo)}`,
  noValidToken: 'Unauthorized. Error while checking token:'
}
