import passport from 'passport'
import express from 'express'

import * as middlewares from './middlewares'

import _cloneDeep from 'lodash/cloneDeep'
import _get from 'lodash/get'

import { logoutRouter } from './routes'

class Auth {
  // Options that passed to initAuth.js
  init (backend, options) {
    this.model = backend.createModel()
    this.router = express.Router()

    this.passport = passport
    this.passport.serializeUser(_get(options, 'passport.serializeUser', this.serializeUser))
    this.passport.deserializeUser(_get(options, 'passport.deserializeUser', this.deserializeUser))

    this.options = _cloneDeep(options)

    for (const strategy of Object.keys(options.strategies)) {
      const { config, init } = options.strategies[strategy]

      // TODO: init each strategy and specific routes
      // init fn must be passed to config for each strategy
      init(config, this.router)
    }

    // Init logout router here
    logoutRouter(this.router)
  }

  getRouter () {
    return this.router
  }

  serializeUser (userId, done) {
    done(null, userId)
  }

  deserializeUser (userId, done) {
    done(null, userId)
  }

  authenticatedPage (req, res) {
    res.send(`
      <p>Authorization successful!</p>
      <p>You will be redirected back in just a second.</p>
      <script>setTimeout(function(){window.location.href = '/'}, 100)</script>
    `)
  }

  middleware () {
    return (req, res, next) => {
      this.passport.initialize()(req, res, err => {
        if (err) return next(err)
        this.passport.session()(req, res, err => {
          if (err) return next(err)
          middlewares.ensureAuthenticated(req, res, () => {
            this.router.handle(req, res, err => {
              if (err) return next(err)
              next()
            })
          })
        })
      })
    }
  }
}

export default new Auth()
