const nconf = require('nconf')
const path = require('path')
const fs = require('fs')
const isArray = require('lodash/isArray')
const each = require('lodash/each')

let app = process.env.APP
let stage = process.env.STAGE

initNconf(process.env.ROOT_PATH || process.cwd())

function initNconf (dirname) {
  let addNconfFile = (nconf, filename) => {
    let filePath = path.join(dirname, 'config', filename + '.json')
    if (fs.existsSync(filePath)) {
      nconf.file(filePath)
      return true
    }
    console.log('Warning! APP and/or STATE are provided but config file ' +
        'wasn\'t found: ' + filePath)
    return false
  }

  // This needs because Windows has default PUBLIC env variable, so nconf doesn't see our PUBLIC variable
  delete process.env.PUBLIC

  nconf.env()
  if (app && stage) addNconfFile(nconf, app + '_' + stage)
  else if (stage) addNconfFile(nconf, stage)
  else if (app) addNconfFile(nconf, app)

  nconf.file('private', dirname + '/config.private.json')
  nconf.defaults(require(dirname + '/config.json'))

  if (!process.env.NODE_ENV && nconf.get('NODE_ENV')) {
    process.env.NODE_ENV = nconf.get('NODE_ENV')
  }

  // Copy BASE_URL into env if present
  if (!process.env.BASE_URL && nconf.get('BASE_URL')) {
    process.env.BASE_URL = nconf.get('BASE_URL')
  }

  // Copy REDIS_URL into env if present (it'll be used by redis-url module)
  if (!process.env.REDIS_URL && nconf.get('REDIS_URL')) {
    process.env.REDIS_URL = nconf.get('REDIS_URL')
  }

  // Copy MONGO_URL into env if present
  if (!process.env.MONGO_URL && nconf.get('MONGO_URL')) {
    process.env.MONGO_URL = nconf.get('MONGO_URL')
  }

  // Copy stuff required in Derby-part and vendor libs into ENV
  if (isArray(nconf.get('COPY_TO_ENV'))) {
    each(nconf.get('COPY_TO_ENV'), (option) => {
      process.env[option] = nconf.get(option)
    })
  }

  // Copy public env vars into global.env
  if (isArray(nconf.get('PUBLIC'))) {
    global.env = global.env || {}
    each(nconf.get('PUBLIC'), (option) => {
      global.env[option] = nconf.get(option)
    })
  }
}

