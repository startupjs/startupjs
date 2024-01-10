import { createRequire } from 'module'
import nconf from 'nconf'
import path from 'path'
import fs from 'fs'
import isArray from 'lodash/isArray.js'
import each from 'lodash/each.js'

const app = process.env.APP
const stage = process.env.STAGE
const require = createRequire(import.meta.url)

initNconf(process.env.ROOT_PATH || process.cwd())

function initNconf (dirname) {
  const addNconfFile = (nconf, filename) => {
    const filePath = path.join(dirname, 'config', filename + '.json')
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

  // Copy public env vars into global.publicEnv
  if (isArray(nconf.get('PUBLIC'))) {
    global.publicEnv = global.publicEnv || {}
    each(nconf.get('PUBLIC'), (option) => {
      global.publicEnv[option] = nconf.get(option)
    })
  }
}

// to prevent dead code elimination
export default () => {}
