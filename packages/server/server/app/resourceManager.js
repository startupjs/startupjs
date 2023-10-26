// Resource Manager (for js and css bundles)
// All functions are memoized since their result is constant within
// the life period of the application. And depends only on the type of
// resource and the name of the application

const path = require('path')
const fs = require('fs')
const memoize = require('lodash/memoize')

let BUILD_CLIENT_PATH = process.env.BUILD_CLIENT_PATH || '/build/client/'
let PROJECT_PATH = process.env.PROJECT_PATH || process.cwd()

exports.getResourcePath = memoize((type, appName, options = {}) => {
  let prefix = ''
  let url = 'ERROR_EMPTY'
  let postfix = ''
  switch (type) {
    case 'bundle':
      if (process.env.NODE_ENV === 'production') {
        prefix = options.BUILD_REFERENCE_URL || ''
        postfix = '.' + exports.getHash(appName, type, options)
      } else {
        prefix = process.env.DEVSERVER_URL ||
            ('http://localhost:' + (options.DEV_PORT || process.env.DEV_PORT || 3010))
      }
      url = prefix + BUILD_CLIENT_PATH + appName + postfix + '.js'
      break
    case 'style':
      url = BUILD_CLIENT_PATH + appName + '.css'
      break
    default:
      throw new Error('No resource found for \'' + type + '\'')
  }
  return url
}, (...args) => JSON.stringify(args))

// Get assets hashes in production (used for long term caching)
exports.getHash = memoize((appName, type, options = {}) => {
  if (process.env.NODE_ENV !== 'production') return
  if (!appName) return ''
  let assetsMeta
  let hash = ''
  PROJECT_PATH = options.PROJECT_PATH || PROJECT_PATH
  let assetsMetaPath = path.join(PROJECT_PATH, BUILD_CLIENT_PATH, 'assets.json')
  try {
    assetsMeta = require(assetsMetaPath)
  } catch (e) {
    throw new Error('Error loading assets meta file at: ' + assetsMetaPath)
  }
  switch (type) {
    case 'bundle':
      hash = assetsMeta && assetsMeta[appName] && assetsMeta[appName].js
      if (!hash) {
        throw new Error('No hash found for \'' + appName + '\' ' + type + ' in ' + assetsMetaPath)
      }
      hash = hash.match(/\.([^.]+)\.js$/)
      hash && (hash = hash[1])
      if (!hash) {
        throw new Error('No hash in bundle filename. Filename should be in the following format: \'[name].[hash].js\'')
      }
      break
    default:
      throw new Error('No hash exists for assets of type \'' + type + '\'')
  }
  return hash
})

// DEPRECATED
exports.getProductionStyles = memoize((appName, options = {}) => {
  PROJECT_PATH = options.PROJECT_PATH || PROJECT_PATH
  const styleRelPath = exports.getResourcePath('style', appName, options)
  const stylePath = path.join(PROJECT_PATH, styleRelPath)
  if (!fs.existsSync(stylePath)) {
    console.error('No stylesheets found for \'' + appName +
        '\' at path: ' + stylePath)
    return
  }
  const style = fs.readFileSync(stylePath, { encoding: 'utf8' })
  return '<style>' + style + '</style>'
})
