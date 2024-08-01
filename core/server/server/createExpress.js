import { ROOT_MODULE as MODULE } from '@startupjs/registry'
import express from 'express'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import methodOverride from 'method-override'
import hsts from 'hsts'
import { readFileSync } from 'fs'
import { join } from 'path'
import { _createMiddleware } from './createMiddleware.js'
import renderApp from '../renderApp/index.js'
import renderError from '../renderError/index.js'

const WWW_REGEXP = /www\./

export default async function createExpress ({ backend, session, channel, options = {} }) {
  const expressApp = express()

  // Required to be able to determine whether the protocol is 'http' or 'https'
  expressApp.enable('trust proxy')

  // ----------------------------------------------------->    logs    <#
  MODULE.hook('logs', expressApp)

  function shouldCompress (req, res) {
    if (req.headers['x-no-compression']) {
      // don't compress responses with this request header
      return false
    }

    // fallback to standard filter function
    return compression.filter(req, res)
  }

  expressApp
    .use(compression({ filter: shouldCompress }))
    .use('/healthcheck', (req, res) => res.status(200).send('OK'))

  if (process.env.FORCE_HTTPS_REDIRECT) {
    // Redirect http to https
    expressApp.use((req, res, next) => {
      if (req.protocol !== 'https') {
        return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`)
      }
      next()
    })
    // enforce https for 180 days
    expressApp.use(hsts({ maxAge: 15552000 }))
  }

  // get rid of 'www.' from url
  expressApp.use((req, res, next) => {
    if (WWW_REGEXP.test(req.headers.host)) {
      const newHost = req.headers.host.replace(WWW_REGEXP, '')
      return res.redirect(301, `${req.protocol}://${newHost}${req.originalUrl}`)
    }
    next()
  })

  // host static files
  MODULE.hook('static', expressApp)
  expressApp.use(express.static(options.publicPath, { maxAge: '1h', index: false }))
  if (!options.isExpo) {
    expressApp.use('/build/client', express.static(options.dirname + '/build/client', { maxAge: '1h' }))
  }

  expressApp.use(cookieParser())
  expressApp.use(methodOverride())

  const startupjsMiddleware = await _createMiddleware({ backend, session, channel, options })
  expressApp.use(startupjsMiddleware)

  // render the single page client app for any route which wasn't handled by the server routes
  if (options.isExpo) {
    const indexFile = readFileSync(join(options.publicPath, 'index.html'), 'utf8')
    expressApp.use((req, res, next) => { res.status(200).send(indexFile) })
  } else {
    expressApp.use(renderApp(options))
  }

  expressApp.use(function (err, req, res, next) {
    if (err.name === 'MongoError' && err.message === 'Topology was destroyed') {
      process.exit()
    }
    next(err)
  })

  expressApp.use((options.error || renderError)(options))

  return expressApp
}
