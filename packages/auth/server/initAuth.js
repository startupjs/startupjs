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

  ee.on('backend', backend => {
    const model = backend.createModel()

    // Init each strategy
    for (const strategy of strategies) {
      const { config, init } = strategy
      init({ model, router, config })
    }
  })

  ee.on('afterSession', expressApp => {
    expressApp.use(passportMiddleware(router))
  })
}
