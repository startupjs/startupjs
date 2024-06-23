import { Suspense, createElement as el } from 'react'
import { axios } from 'startupjs'
import { createPlugin } from '@startupjs/registry'
import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'
import getAppSecret from '../utils/getAppSecret.js'
import createToken from '../utils/createToken.js'
import { setUserData, getUserData } from '../utils/clientUserData.js'

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
            jwt.verify(token, appSecret)
            return res.json({ [NOT_CHANGED_KEY]: true })
          } catch (err) {}
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
          req.user = jwt.verify(token, await getAppSecret())
          next()
        } catch (err) {
          return res.status(401).send(ERRORS.noValidToken + '\n' + err.message)
        }
      })
    }
  }),
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
  let user = await getUserData()
  const res = await axios.post(URL_ANONYMOUS_TOKEN, { token: user?.token })
  // TODO: handle errors like 500 etc.
  if (!res.data?.[NOT_CHANGED_KEY]) user = res.data
  await setUserData(user)
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

const ERRORS = {
  noValidToken: 'Unauthorized. Error while checking token:'
}
