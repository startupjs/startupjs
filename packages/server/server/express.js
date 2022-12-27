const routesMiddleware = require('@startupjs/routes-middleware')
const _defaults = require('lodash/defaults')
const _cloneDeep = require('lodash/cloneDeep')
const conf = require('nconf')
const express = require('express')
const expressSession = require('express-session')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const MongoStore = require('connect-mongo')
const hsts = require('hsts')
const cors = require('cors')
const FORCE_HTTPS = conf.get('FORCE_HTTPS_REDIRECT')
const DEFAULT_SESSION_MAX_AGE = 1000 * 60 * 60 * 24 * 365 * 2 // 2 years
const DEFAULT_BODY_PARSER_OPTIONS = {
  urlencoded: {
    extended: true
  }
}
const WWW_REGEXP = /www\./

function getDefaultSessionUpdateInterval (sessionMaxAge) {
  // maxAge is in ms. Return in s. So it's 1/10nth of maxAge.
  return Math.floor(sessionMaxAge / 1000 / 10)
}

module.exports = (backend, mongoClient, appRoutes, error, options) => {
  const connectMongoOptions = { client: mongoClient }

  if (options.sessionMaxAge) {
    connectMongoOptions.touchAfter = options.sessionUpdateInterval ||
        getDefaultSessionUpdateInterval(options.sessionMaxAge)
  }

  let sessionStore
  if (conf.get('MONGO_URL') && !conf.get('NO_MONGO')) {
    sessionStore = MongoStore.create(connectMongoOptions)
  }

  const session = expressSession({
    secret: conf.get('SESSION_SECRET'),
    store: sessionStore,
    cookie: {
      maxAge: options.sessionMaxAge || DEFAULT_SESSION_MAX_AGE,
      secure: options.cookiesSecure || false,
      sameSite: options.sameSite
    },
    saveUninitialized: true,
    resave: false,
    // when sessionMaxAge is set, we want to update cookie expiration time
    // on each request
    rolling: !!options.sessionMaxAge
  })

  const expressApp = express()

  // Required to be able to determine whether the protocol is 'http' or 'https'
  if (FORCE_HTTPS || options.trustProxy) expressApp.enable('trust proxy')

  // ----------------------------------------------------->    logs    <#
  options.ee.emit('logs', expressApp)

  expressApp
    .use(compression())
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

  if (process.env.NODE_ENV !== 'production' && process.env.VITE) {
    // Enable cors requests from localhost in dev
    expressApp.use(cors({ origin: /(?:127\.0\.0\.1|localhost):?\d*$/ }))
    // Redirect to https 3010 port in dev
    const VITE_PORT = 3010
    expressApp.use((req, res, next) => {
      if (req.method === 'GET' && (req.path === '/' || req.path === '')) {
        return res.redirect(301, 'https://' + req.get('host').replace(/:?\d+$/, ':' + VITE_PORT) + req.originalUrl)
      }
      next()
    })
  }

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

  // Server routes
  // ----------------------------------------------------->      routes      <#
  options.ee.emit('routes', expressApp)

  expressApp.use(routesMiddleware(appRoutes, options))

  expressApp
    .all('*', (req, res, next) => next('404: ' + req.url))
    .use(function (err, req, res, next) {
      if (err.name === 'MongoError' && err.message === 'Topology was destroyed') {
        process.exit()
      }
      next(err)
    })
    .use(error)

  return { expressApp, session }
}

function getBodyParserOptionsByType (type, options = {}) {
  return _defaults(
    _cloneDeep(options[type]),
    options.general,
    DEFAULT_BODY_PARSER_OPTIONS[type],
    DEFAULT_BODY_PARSER_OPTIONS.general
  )
}
