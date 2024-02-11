import { ROOT_MODULE as MODULE, ROOT_MODULE } from '@startupjs/registry'
import { existsSync } from 'fs'
import { join } from 'path'
import express from 'express'
import { router } from 'express-file-routing'

const SERVER_ROUTES_FOLDER = 'server'

/**
 * A connect middleware with core startupjs functionality. You can plug this into your
 * existing node server.
 * @returns {express.Application}
 */
export default async function createMiddleware ({ backend, session, channel, options }) {
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

  // filesystem-based routing
  if (ROOT_MODULE.options.enableServer && existsSync(join(options.dirname, SERVER_ROUTES_FOLDER))) {
    try {
      app.use('/', await router({ directory: join(options.dirname, SERVER_ROUTES_FOLDER) }))
    } catch (err) {
      console.error(ERRORS.serverRoutes)
      throw err
    }
  }

  options.ee.emit('routes', app) // DEPRECATED (use 'serverRoutes' hook instead)
  MODULE.hook('serverRoutes', app)

  app.use(function (err, req, res, next) {
    if (err.name === 'MongoError' && err.message === 'Topology was destroyed') {
      process.exit()
    }
    next(err)
  })

  return app
}

const ERRORS = {
  serverRoutes: `
    [@startupjs/server] Error auto-loading server routes. Make sure that you either use \`.mjs\` file extensions
    or set \`"type": "module"\` in your package.json so that \`.js\` files are treated as ESM.
  `
}
