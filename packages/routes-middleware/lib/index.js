const { matchRoutes } = require('react-router-config')
const fs = require('fs')
const _keys = require('lodash/keys')
const _isArray = require('lodash/isArray')
const defaultClientLayout = require('./defaultClientLayout')
const resourceManager = require('./resourceManager')
const DEFAULT_APP_NAME = 'main'
// `react-native` mode makes all root DOM elements fullscreen
// with flex-direction column and removes scroll (ScrollView has to be used).
// If you don't want this -- specify { mode: 'web' } in options.
const DEFAULT_MODE = 'react-native'

// Client Apps routes
module.exports = function (appRoutes, options = {}) {
  // When routes are specified as an array
  // treat it as being just a single bundle with the default name.
  if (_isArray(appRoutes)) {
    appRoutes = { [DEFAULT_APP_NAME]: appRoutes }
  }

  const getHead = options.getHead || (() => '')

  return function (req, res, next) {
    let matched
    // If no client-side routes provided, always render the page
    if (Object.keys(appRoutes).length === 0) {
      matched = { appName: DEFAULT_APP_NAME, match: {} }
    } else {
      matched = matchAppRoutes(req.url, appRoutes)
    }
    if (!matched) return next()
    if (matched.redirect) return res.redirect(307, matched.redirect)
    const model = req.model
    const [url, search] = req.url.split('?')
    // reproduce '$render' collection
    // because filters are isomorphic
    // and can use '$render' on the client from @startupjs/app
    model.set('$render.url', url)
    model.set('$render.search', search ? '?' + search : '')
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
          return filter(model, runFilter, (url) => res.redirect(307, url))
        }
        done()
      }
      runFilter()
    }

    renderApp(matched, (err) => {
      if (err) {
        return next(
          isNaN(err)
            ? '500: ' + req.url + '. Error: ' + err
            : err
        )
      }
      const appName = matched.appName
      const html = (options.getClientLayout || defaultClientLayout)({
        head: getHead(appName, req),
        styles: process.env.NODE_ENV === 'production' && options.mode === 'web'
          ? resourceManager.getProductionStyles(appName, options) : '',
        jsBundle: resourceManager.getResourcePath('bundle', appName, options),
        mode: options.mode || DEFAULT_MODE,
        fontsStyles: getFontsStyles() || ''
      })
      res.status(200).send(html)
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
  if (matched.length) {
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

function getFontsStyles () {
  const FONTS_PATH = process.cwd() + '/public/fonts'
  const EXT_WISHLIST = ['eot', 'otf', 'ttf', 'woff', 'woff2']
  const FONTS_FORMAT = {
    'eot?#iefix': 'embedded-opentype',
    otf: 'opentype',
    ttf: 'truetype',
    woff: 'woff',
    woff2: 'woff2'
  }

  if (fs.existsSync(FONTS_PATH)) {
    let files = fs.readdirSync(FONTS_PATH)
    files = files.filter(file => EXT_WISHLIST.indexOf(file.split('.')[1]) !== -1)

    // parse files to format:
    // { fontName: ['ttf', 'otf'] }
    const data = files.reduce((acc, item) => {
      const [fileName, fileExt] = item.split('.')
      if (!acc[fileName]) acc[fileName] = []
      acc[fileName].push(fileExt)
      return acc
    }, {})

    return Object.keys(data).reduce((css, fileName) => {
      const srcs = data[fileName].reduce((acc, fileExt, index, arr) => {
        if (fileExt === 'eot') fileExt = 'eot?#iefix'
        acc += `url('/fonts/${fileName}.${fileExt}') format('${FONTS_FORMAT[fileExt]}')`

        if (index !== arr.length - 1) acc += ',\n'
        return acc
      }, '')

      css += `@font-face {
        font-family: ${fileName};
        src: url('/fonts/${fileName}.${data[fileName][0]}');
        src: ${srcs};
      }\n`

      return css
    }, '')
  }
}
