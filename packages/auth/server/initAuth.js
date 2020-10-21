/**
 * @example
*   initAuth(ee, {
*     strategies: {
*       local: {
*         init: (model, router, config) => {} // like initLocal func in auth.js, fn for passport initialisation
*         config: {}
*       }
*     }
*   })
 */

import passport from 'passport'
import express from 'express'
import routes from './routes'
import { passportMiddleware } from './middlewares'

export default function initAuth (ee, opts) {
  const { strategies } = opts
  const router = express.Router()

  ee.on('backend', backend => {
    const model = backend.createModel()

    // Init each strategy
    for (const strategyKey of Object.keys(strategies)) {
      const { config, init } = strategies[strategyKey]
      init(model, router, config)
    }

    // Init default routes
    for (const initRoute of routes) {
      initRoute(router)
    }
  })

  ee.on('afterSession', expressApp => {
    expressApp.use(passportMiddleware(passport, router))
  })
}
