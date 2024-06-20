import { ROOT_MODULE as MODULE, ROOT_MODULE } from '@startupjs/registry'
import { existsSync, readdirSync } from 'fs'
import { join } from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import { router } from 'express-file-routing'

const SERVER_FOLDER = 'server'
const MIDDLEWARE_FILENAME_REGEX = /^middleware\.[mc]?[jt]sx?$/
const API_ROUTES_FOLDER = join(SERVER_FOLDER, 'api')

/**
 * A connect middleware with core startupjs functionality. You can plug this into your
 * existing node server.
 * @returns {express.Application}
 */
export default async function createMiddleware ({ backend, session, channel, options }) {
  const app = express()
  app.use(bodyParser.json(options.bodyParser?.json))
  app.use(bodyParser.urlencoded({ extended: true, ...options.bodyParser?.urlencoded }))

  MODULE.hook('beforeSession', app)

  app.use(channel.middleware)
  // TODO: change this to maybe use a $ created for each user. And set it as req.$
  // app.use(backend.modelMiddleware())
  if (session) app.use(session)

  options.ee.emit('afterSession', app) // DEPRECATED (use 'afterSession' hook instead)
  MODULE.hook('afterSession', app)

  // Pipe env to client through the model
  // TODO: reimplement this using $ or req.$
  // app.use((req, res, next) => {
  //   if (req.xhr) return next()
  //   const model = req.model
  //   model.set('_session.env', global.publicEnv)
  //   next()
  // })

  options.ee.emit('middleware', app) // DEPRECATED (use 'middleware' hook instead)
  MODULE.hook('middleware', app)

  // filesystem-based middleware
  if (existsSync(join(options.dirname, SERVER_FOLDER))) {
    for (const file of readdirSync(join(options.dirname, SERVER_FOLDER))) {
      if (MIDDLEWARE_FILENAME_REGEX.test(file)) {
        const { default: middleware } = await import(join(options.dirname, SERVER_FOLDER, file))
        if (!(typeof middleware === 'function' || Array.isArray(middleware))) {
          throw Error(ERRORS.incorrectMiddlewareFile(file))
        }
        app.use(middleware)
        break
      }
    }
  }

  MODULE.hook('api', app)

  // filesystem-based routing for hosting project's server/api folder as /api
  if (ROOT_MODULE.options.enableServer && existsSync(join(options.dirname, API_ROUTES_FOLDER))) {
    try {
      app.use('/api', await router({ directory: join(options.dirname, API_ROUTES_FOLDER) }))
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
  `,
  incorrectMiddlewareFile: filename => `
    [@startupjs/server] Incorrect ${SERVER_FOLDER}/${filename} middleware file.
    It should have a default export which is a middleware function or an array of middleware functions.
  `
}
