import './nconf.js'
import defaults from 'lodash/defaults.js'
import path from 'path'
import { EventEmitter } from 'events'
import errorApp from './error/index.js'
import server from './server/index.js'
const ROOT_PATH = process.env.ROOT_PATH || process.cwd()

export default (options = {}, cb) => {
  // Set project dir to process.cwd(). In future we may want to allow to
  // allow the customization of this parameter.
  options.dirname = ROOT_PATH

  defaults(options, {
    publicPath: './public',
    loginUrl: '/login',
    error: errorApp,
    bodyParserLimit: '10mb'
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
