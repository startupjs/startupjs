import { ROOT_MODULE as MODULE } from '@startupjs/registry'
import express from 'express'
import { getToken } from './certificateManager.js'

/**
 * A connect middleware with core startupjs functionality. You can plug this into your
 * existing node server.
 * @returns {express.Application}
 */
export default function createMiddleware ({ backend, session, channel, options }) {
  const app = express()

  MODULE.hook('beforeSession', app)

  app.use(channel.middleware)
  app.use(backend.modelMiddleware())
  app.use(session)

  options.ee.emit('afterSession', app) // DEPRECATED (use 'afterSession' hook instead)
  MODULE.hook('afterSession', app)

  // userId
  app.use((req, res, next) => {
    const model = req.model
    // Set anonymous userId unless it was set by some end-user auth middleware
    if (req.session.userId == null) req.session.userId = model.id()
    // Set userId into model
    model.set('_session.userId', req.session.userId)
    next()
  })

  // Pipe env to client through the model
  app.use((req, res, next) => {
    if (req.xhr) return next()
    const model = req.model
    model.set('_session.env', global.publicEnv)
    next()
  })

  options.ee.emit('middleware', app) // DEPRECATED (use 'middleware' hook instead)
  MODULE.hook('middleware', app)

  MODULE.hook('api', app)

  options.ee.emit('routes', app) // DEPRECATED (use 'serverRoutes' hook instead)
  MODULE.hook('serverRoutes', app)
  if (process.env.HTTPS_DOMAINS || options.https) app.get('/.well-known/acme-challenge/:token', getToken)

  app.use(function (err, req, res, next) {
    if (err.name === 'MongoError' && err.message === 'Topology was destroyed') {
      process.exit()
    }
    next(err)
  })

  return app
}
