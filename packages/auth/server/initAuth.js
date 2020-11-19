import passport from 'passport'
import express from 'express'
import initDefaultRoutes from './initDefaultRoutes'
import { passportMiddleware } from './middlewares'
import { onUserCreate, onLogin, onLogout } from './helpers'
import { DEFAUL_SUCCESS_REDIRECT_URL } from '../isomorphic'

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
    onUserCreate,
    onLogin,
    onLogout
  }, _config)

  console.log('++++++++++ Initialization of auth module ++++++++++\n', config, '\n')
  validateConfigs(config)

  const { strategies, ...rest } = config
  rest.successRedirectUrl = rest.successRedirectUrl || DEFAUL_SUCCESS_REDIRECT_URL

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
          successRedirectUrl: config.successRedirectUrl,
          ...$session.get(),
          ...fields
        })
        next()
      })
    })
  }

  ee.on('backend', backend => {
    const model = backend.createModel()

    // Init each strategy
    for (const initFn of strategies) {
      initFn({
        model,
        router,
        updateClientSession,
        authConfig: rest
      })
    }
  })

  ee.on('afterSession', expressApp => {
    expressApp.use(passportMiddleware(router))
  })
}
