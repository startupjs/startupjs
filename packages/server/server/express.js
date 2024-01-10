import { ROOT_MODULE as MODULE } from '@startupjs/registry'
import _defaults from 'lodash/defaults.js'
import _cloneDeep from 'lodash/cloneDeep.js'
import conf from 'nconf'
import express from 'express'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'
import hsts from 'hsts'
import app from './app/index.js'

const FORCE_HTTPS = conf.get('FORCE_HTTPS_REDIRECT')
const DEFAULT_BODY_PARSER_OPTIONS = {
  urlencoded: {
    extended: true
  }
}
const WWW_REGEXP = /www\./

export function createExpress ({ backend, error, options, session }) {
  const expressApp = express()

  // Required to be able to determine whether the protocol is 'http' or 'https'
  if (FORCE_HTTPS || options.trustProxy) expressApp.enable('trust proxy')

  // ----------------------------------------------------->    logs    <#
  options.ee.emit('logs', expressApp)
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

  if (FORCE_HTTPS) {
    // Redirect http to https
    expressApp
      .use((req, res, next) => {
        if (req.protocol !== 'https') {
          return res.redirect(301, 'https://' + req.get('host') + req.originalUrl)
        }
        next()
      })
      .use(hsts({ maxAge: 15552000 })) // enforce https for 180 days
  }

  // get rid of 'www.' from url
  expressApp.use((req, res, next) => {
    if (WWW_REGEXP.test(req.hostname)) {
      const newHostname = req.hostname.replace(WWW_REGEXP, '')
      return res.redirect(
        301,
        req.protocol + '://' + newHostname + req.originalUrl
      )
    }
    next()
  })

  // ----------------------------------------------------->    static    <#
  options.ee.emit('static', expressApp)
  MODULE.hook('static', expressApp)

  expressApp
    .use(express.static(options.publicPath, { maxAge: '1h' }))
    .use('/build/client', express.static(options.dirname + '/build/client', { maxAge: '1h' }))
    .use(cookieParser())
    .use(bodyParser.json(getBodyParserOptionsByType('json', options.bodyParser)))
    .use(bodyParser.urlencoded(getBodyParserOptionsByType('urlencoded', options.bodyParser)))
    .use(methodOverride())
    .use(session)
    .use(backend.modelMiddleware())

  // ----------------------------------------------------->    afterSession    <#
  options.ee.emit('afterSession', expressApp)
  MODULE.hook('afterSession', expressApp)

  // userId
  expressApp.use((req, res, next) => {
    const model = req.model
    // Set anonymous userId unless it was set by some end-user auth middleware
    if (req.session.userId == null) req.session.userId = model.id()
    // Set userId into model
    model.set('_session.userId', req.session.userId)
    next()
  })

  // Pipe env to client through the model
  expressApp.use((req, res, next) => {
    if (req.xhr) return next()
    const model = req.model
    model.set('_session.env', global.env)
    next()
  })

  // ----------------------------------------------------->    middleware    <#
  options.ee.emit('middleware', expressApp)
  MODULE.hook('middleware', expressApp)

  MODULE.hook('api', expressApp)

  // Server routes
  // ----------------------------------------------------->      routes      <#
  options.ee.emit('routes', expressApp)
  MODULE.hook('routes', expressApp)

  const appMiddleware = app(options)

  expressApp
    .use(appMiddleware)
    .use(function (err, req, res, next) {
      if (err.name === 'MongoError' && err.message === 'Topology was destroyed') {
        process.exit()
      }
      next(err)
    })
    .use(error)

  return expressApp
}

function getBodyParserOptionsByType (type, options = {}) {
  return _defaults(
    _cloneDeep(options[type]),
    options.general,
    DEFAULT_BODY_PARSER_OPTIONS[type],
    DEFAULT_BODY_PARSER_OPTIONS.general
  )
}
