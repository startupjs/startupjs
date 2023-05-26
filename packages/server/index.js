// Initialize nconf with proper config
// TODO: refactor to use .env everywhere
require('./nconf')

const defaults = require('lodash/defaults')
const path = require('path')
const EventEmitter = require('events').EventEmitter
const errorApp = require('./error')
const server = require('./server')

const ROOT_PATH = process.env.ROOT_PATH || process.cwd()

module.exports = (options = {}, cb) => {
  // Set project dir to process.cwd(). In future we may want to allow to
  // allow the customization of this parameter.
  options.dirname = ROOT_PATH

  defaults(options, {
    appRoutes: {},
    publicPath: './public',
    loginUrl: '/login',
    bodyParserLimit: '10mb',
    error: errorApp
  })

  // Transform public path to be absolute
  options.publicPath = path.resolve(options.dirname, options.publicPath)

  // Run cb to setup additional options that require initialized nconf
  // and do event handling
  options.ee = new EventEmitter()
  cb && cb(options.ee, options)

  // Run app
  server(options)
}
