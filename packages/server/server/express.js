const _keys = require('lodash/keys')
const _memoize = require('lodash/memoize')
const _defaults = require('lodash/defaults')
const _cloneDeep = require('lodash/cloneDeep')
const conf = require('nconf')
const express = require('express')
const fs = require('fs')
const expressSession = require('express-session')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const connectMongo = require('connect-mongo')
const racerHighway = require('racer-highway')
const resourceManager = require('./resourceManager')
const defaultClientLayout = require('./defaultClientLayout')
const { matchRoutes } = require('react-router-config')
const hsts = require('hsts')
const FORCE_HTTPS = conf.get('FORCE_HTTPS_REDIRECT')
const DEFAULT_SESSION_MAX_AGE = 1000 * 60 * 60 * 24 * 365 * 2 // 2 years
const DEFAULT_BODY_PARSER_OPTIONS = {
  urlencoded: {
    extended: true
  }
}
const DEFAULT_APP_NAME = 'main'
function getDefaultSessionUpdateInterval (sessionMaxAge) {
  // maxAge is in ms. Return in s. So it's 1/10nth of maxAge.
  return Math.floor(sessionMaxAge / 1000 / 10)
}

module.exports = (backend, appRoutes, error, options, cb) => {
  const MongoStore = connectMongo(expressSession)
  const mongoUrl = conf.get('MONGO_URL')

  const connectMongoOptions = { url: mongoUrl }
  if (options.sessionMaxAge) {
    connectMongoOptions.touchAfter = options.sessionUpdateInterval ||
        getDefaultSessionUpdateInterval(options.sessionMaxAge)
  }
  if (process.env.MONGO_SSL_CERT_PATH && process.env.MONGO_SSL_KEY_PATH) {
    const sslCert = fs.readFileSync(process.env.MONGO_SSL_CERT_PATH)
    const sslKey = fs.readFileSync(process.env.MONGO_SSL_KEY_PATH)
    connectMongoOptions.mongoOptions = {
      server: {
        sslValidate: false,
        sslKey: sslKey,
        sslCert: sslCert
      }
    }
  }
  const sessionStore = new MongoStore(connectMongoOptions)
  sessionStore.on('connected', () => {
    const session = expressSession({
      secret: conf.get('SESSION_SECRET'),
      store: sessionStore,
      cookie: {
        maxAge: options.sessionMaxAge || DEFAULT_SESSION_MAX_AGE,
        secure: options.cookiesSecure || false
      },
      saveUninitialized: true,
      resave: false,
      // when sessionMaxAge is set, we want to update cookie expiration time
      // on each request
      rolling: !!options.sessionMaxAge
    })

    const clientOptions = {
      timeout: 5000,
      timeoutIncrement: 8000
    }
    const hwHandlers = racerHighway(backend, { session }, clientOptions)

    const expressApp = express()

    // Required to be able to determine whether the protocol is 'http' or 'https'
    if (FORCE_HTTPS) expressApp.enable('trust proxy')

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

    expressApp
      .use(express.static(options.publicPath, { maxAge: '1h' }))
      .use('/build/client', express.static(options.dirname + '/build/client', { maxAge: '1h' }))
      .use(backend.modelMiddleware())
      .use(cookieParser())
      .use(bodyParser.json(getBodyParserOptionsByType('json', options.bodyParser)))
      .use(bodyParser.urlencoded(getBodyParserOptionsByType('urlencoded', options.bodyParser)))
      .use(methodOverride())
      .use(session)

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

    expressApp.use(hwHandlers.middleware)

    // ----------------------------------------------------->    middleware    <#
    options.ee.emit('middleware', expressApp)

    // Server routes
    // ----------------------------------------------------->      routes      <#
    options.ee.emit('routes', expressApp)

    // Client Apps routes
    // Memoize getting the end-user <head> code
    const getHead = _memoize(options.getHead || (() => ''))

    expressApp.use((req, res, next) => {
      let matched
      // If no client-side routes provided, always render the page
      if (Object.keys(appRoutes).length === 0) {
        matched = { appName: DEFAULT_APP_NAME }
      } else {
        matched = matchAppRoutes(req.url, appRoutes)
      }
      if (!matched) return next()
      if (matched.redirect) return res.redirect(302, matched.redirect)
      const model = req.model
      model.set('$render.match', matched.match)
      function renderApp (route, done) {
        let filters = route.filters
        if (!filters) return done()
        filters = filters.slice()
        function runFilter (err) {
          if (err) return done(err)
          const filter = filters.shift()
          if (typeof filter === 'function') {
            return filter(model, runFilter, res.redirect.bind(res))
          }
          done()
        }
        runFilter()
      }

      renderApp(matched, (err) => {
        if (err) return next(err)
        const appName = matched.appName
        model.silent().destroy('$render')
        model.bundle((err, bundle) => {
          if (err) return next('500: ' + req.url + '. Error: ' + err)
          const html = defaultClientLayout({
            styles: process.env.NODE_ENV === 'production'
              ? resourceManager.getProductionStyles(appName) : '',
            head: getHead(appName),
            modelBundle: bundle,
            jsBundle: resourceManager.getResourcePath('bundle', appName),
            env: model.get('_session.env') || {}
          })
          res.status(200).send(html)
        })
      })
    })

    expressApp
      .all('*', (req, res, next) => next('404: ' + req.url))
      .use(function (err, req, res, next) {
        if (err.name === 'MongoError' && err.message === 'Topology was destroyed') {
          process.exit()
        }
        next(err)
      })
      .use(error)

    cb({
      expressApp: expressApp,
      upgrade: hwHandlers.upgrade,
      wss: hwHandlers.wss
    })
  })
}

function getBodyParserOptionsByType (type, options = {}) {
  return _defaults(
    _cloneDeep(options[type]),
    options.general,
    DEFAULT_BODY_PARSER_OPTIONS[type],
    DEFAULT_BODY_PARSER_OPTIONS.general
  )
}

function matchUrl (location, routes, cb) {
  const matched = matchRoutes(routes, location.replace(/\?.*/, ''))
  if (matched && matched.length) {
    // check if the last route has redirect
    const lastRoute = matched[matched.length - 1]
    if (lastRoute.route.redirect) {
      return { redirect: lastRoute.route.redirect }
    // explicitely check that path is present,
    // because it's possible that only the Root component was matched
    // which doesn't actually render anything real,
    // but just a side-effect of react-router config structure.
    } else if (lastRoute.route.path) {
      return {
        render: true,
        filters: lastRoute.route.filters,
        match: lastRoute.match
      }
    }
  }
  return false
}

function matchAppRoutes (location, appRoutes, cb) {
  const appNames = _keys(appRoutes)
  for (const appName of appNames) {
    const routes = appRoutes[appName]
    const result = matchUrl(location, routes)
    if (result) return Object.assign({ appName }, result)
  }
  return false
}
