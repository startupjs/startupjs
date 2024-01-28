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
import { readFileSync } from 'fs'
import { join } from 'path'
import createMiddleware from './createMiddleware.js'
import renderApp from '../renderApp/index.js'
import renderError from '../renderError/index.js'

const FORCE_HTTPS = conf.get('FORCE_HTTPS_REDIRECT')
const DEFAULT_BODY_PARSER_OPTIONS = {
  urlencoded: {
    extended: true
  }
}
const WWW_REGEXP = /www\./

export default function createExpress ({ backend, session, channel, options = {} }) {
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

  options.ee.emit('static', expressApp)
  MODULE.hook('static', expressApp)

  expressApp
    .use(express.static(options.publicPath, { maxAge: '1h' }))
    .use('/build/client', express.static(options.dirname + '/build/client', { maxAge: '1h' }))
    .use(cookieParser())
    .use(bodyParser.json(getBodyParserOptionsByType('json', options.bodyParser)))
    .use(bodyParser.urlencoded(getBodyParserOptionsByType('urlencoded', options.bodyParser)))
    .use(methodOverride())

  const startupjsMiddleware = createMiddleware({ backend, session, channel, options })
  expressApp.use(startupjsMiddleware)

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

function getBodyParserOptionsByType (type, options = {}) {
  return _defaults(
    _cloneDeep(options[type]),
    options.general,
    DEFAULT_BODY_PARSER_OPTIONS[type],
    DEFAULT_BODY_PARSER_OPTIONS.general
  )
}
