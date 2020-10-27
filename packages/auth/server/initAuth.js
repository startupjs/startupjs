import passport from 'passport'
import express from 'express'
import initDefaultRoutes from './initDefaultRoutes'
import { passportMiddleware } from './middlewares'

const router = express.Router()

// Init default routes
initDefaultRoutes(router)

function serializeUser (userId, done) {
  done(null, userId)
}

function deserializeUser (userId, done) {
  done(null, userId)
}

export default function init (ee, opts) {
  console.log('++++++++++ Initialization of auth module ++++++++++')

  const { strategies } = opts

  passport.serializeUser(serializeUser)
  passport.deserializeUser(deserializeUser)

  // Use that helper to add some important data to client session
  // We avoid usage of .env file so we should store all client config in session
  function updateClientSession (fields) {
    ee.on('afterSession', expressApp => {
      expressApp.use((req, res, next) => {
        const $session = req.model.scope('_session.auth')
        $session.set({ ...$session.get(), ...fields })
        next()
      })
    })
  }

  ee.on('backend', backend => {
    const model = backend.createModel()

    // Init each strategy
    for (const strategy of strategies) {
      const { config, init } = strategy
      init({ model, router, config, updateClientSession })
    }
  })

  ee.on('afterSession', expressApp => {
    // // Save config to req to access ot from routes
    // expressApp.use((req, res, next) => {
    //   req.authConfig = opts
    //   next()
    // })
    expressApp.use(passportMiddleware(router))
  })
}
