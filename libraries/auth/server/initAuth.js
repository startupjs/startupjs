import passport from 'passport'
import express from 'express'
import {
  parseUserCreationData,
  onBeforeLoginHook,
  onBeforeLogoutHook,
  onAfterUserCreationHook,
  onAfterLoginHook
} from './helpers/index.js'
import initDefaultRoutes from './initDefaultRoutes.js'
import { passportMiddleware } from './middlewares/index.js'
import { SIGN_IN_URL } from '../isomorphic/index.js'
import { auth } from './index.js'

const DEFAULT_EXPIRES_REDIRECT_URL = 5 * 60000 // 5 min in ms

const router = express.Router()

function serializeUser (userId, done) {
  done(null, userId)
}

function deserializeUser (userId, done) {
  done(null, userId)
}

function validateConfigs ({ strategies }) {
  if (!strategies || !strategies.length) {
    throw new Error('[@dmapper/auth] Error:', 'Provide at least one strategy')
  }
}

export default function (ee, _config) {
  const config = {}
  Object.assign(config, {
    signInPageUrl: SIGN_IN_URL,
    parseUserCreationData,
    onBeforeLogoutHook,
    onBeforeLoginHook,
    onAfterUserCreationHook,
    onAfterLoginHook
  }, _config)

  console.log('++++++++++ Initialization of auth module ++++++++++\n')
  validateConfigs(config)

  const { strategies, ...rest } = config
  auth.config = _config
  rest.expiresRedirectUrl = rest.expiresRedirectUrl || DEFAULT_EXPIRES_REDIRECT_URL

  passport.serializeUser(serializeUser)
  passport.deserializeUser(deserializeUser)

  // Init default routes
  initDefaultRoutes(router, config)

  // Use that helper to add some important data to client session
  // We avoid usage of .env file so we should store all client config in session
  function updateClientSession (fields) {
    ee.on('afterSession', expressApp => {
      expressApp.use((req, res, next) => {
        const $session = req.model.scope('_session.auth')
        $session.set({
          signInPageUrl: config.signInPageUrl,
          expiresRedirectUrl: rest.expiresRedirectUrl,
          ...$session.get(),
          ...fields
        })
        next()
      })
    })
  }

  ee.on('backend', backend => {
    // Init each strategy
    for (const initFn of strategies) {
      initFn({
        backend,
        router,
        updateClientSession,
        authConfig: rest
      })
    }
  })

  ee.on('afterSession', expressApp => {
    expressApp.use((req, res, next) => {
      const $session = req.model.scope('_session.auth')
      $session.set('recaptchaEnabled', !!_config.recaptchaEnabled)
      next()
    })
    expressApp.use(passportMiddleware(router))
  })
}
