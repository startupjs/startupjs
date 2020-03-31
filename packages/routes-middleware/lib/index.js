const _memoize = require('lodash/memoize')
const _keys = require('lodash/keys')
const _isArray = require('lodash/isArray')
const defaultClientLayout = require('./defaultClientLayout')
const resourceManager = require('./resourceManager')
const { matchRoutes } = require('react-router-config')
const DEFAULT_APP_NAME = 'main'

// Client Apps routes
module.exports = function (appRoutes, options = {}) {
  // When routes are specified as an array
  // treat it as being just a single bundle with the default name.
  if (_isArray(appRoutes)) {
    appRoutes = { [DEFAULT_APP_NAME]: appRoutes }
  }
  // Memoize getting the end-user <head> code
  const getHead = _memoize(options.getHead || (() => ''))

  return function (req, res, next) {
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
    model.set('$render.url', req.originalUrl)
    model.set('$render.query', req.query)
    model.set('$render.params', matched.match.params)
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
        const html = (options.getClientLayout || defaultClientLayout)({
          styles: process.env.NODE_ENV === 'production'
            ? resourceManager.getProductionStyles(appName, options) : '',
          head: getHead(appName),
          modelBundle: bundle,
          jsBundle: resourceManager.getResourcePath('bundle', appName, options),
          env: model.get('_session.env') || {}
        })
        res.status(200).send(html)
      })
    })
  }
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
