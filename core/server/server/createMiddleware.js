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
export default async function createMiddleware (...args) {
  const expressApp = express()
  const middleware = await _createMiddleware(...args)
  expressApp.use(middleware)
  return expressApp
}

export async function _createMiddleware ({ backend, session, channel, options }) {
  const publicApp = express.Router()

  publicApp.use(bodyParser.json(options.bodyParser?.json))
  publicApp.use(bodyParser.urlencoded({ extended: true, ...options.bodyParser?.urlencoded }))

  publicApp.use(channel.middleware)

  MODULE.hook('beforeSession', publicApp)

  // TODO: change this to maybe use a $ created for each user. And set it as req.$
  // publicApp.use(backend.modelMiddleware())
  if (session) publicApp.use(session)
  MODULE.hook('session', publicApp)

  const protectedApp = express.Router()
  MODULE.hook('afterSession', protectedApp)

  // Pipe env to client through the model
  // TODO: reimplement this using $ or req.$
  // app.use((req, res, next) => {
  //   if (req.xhr) return next()
  //   const model = req.model
  //   model.set('_session.env', global.publicEnv)
  //   next()
  // })

  MODULE.hook('middleware', protectedApp)

  // filesystem-based middleware
  if (existsSync(join(options.dirname, SERVER_FOLDER))) {
    for (const file of readdirSync(join(options.dirname, SERVER_FOLDER))) {
      if (MIDDLEWARE_FILENAME_REGEX.test(file)) {
        const { default: middleware } = await import(join(options.dirname, SERVER_FOLDER, file))
        if (!(typeof middleware === 'function' || Array.isArray(middleware))) {
          throw Error(ERRORS.incorrectMiddlewareFile(file))
        }
        protectedApp.use(middleware)
        break
      }
    }
  }

  MODULE.hook('api', protectedApp)

  // filesystem-based routing for hosting project's server/api folder as /api
  if (ROOT_MODULE.options.enableServer && existsSync(join(options.dirname, API_ROUTES_FOLDER))) {
    try {
      protectedApp.use('/api', await router({ directory: join(options.dirname, API_ROUTES_FOLDER) }))
    } catch (err) {
      console.error(ERRORS.serverRoutes)
      throw err
    }
  }

  if (MODULE.options.enableOAuth2) {
    publicApp.use((req, res, next) => {
      if (!req.session) return next()
      protectedApp(req, res, next)
    })
  } else {
    publicApp.use(protectedApp)
  }

  MODULE.hook('serverRoutes', publicApp)

  publicApp.use(function (err, req, res, next) {
    if (err.name === 'MongoError' && err.message === 'Topology was destroyed') {
      process.exit()
    }
    next(err)
  })

  return publicApp
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

// function isAuthenticatedRequest (req) {
//   return req.headers.authorization || req.headers['x-requested-with'] === 'XMLHttpRequest'
// }
