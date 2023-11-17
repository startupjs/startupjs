import promisifyRacer from '@startupjs/orm/lib/promisifyRacer.js'
import racer from 'racer'
import sharedb from 'sharedb'
import schema from './../lib/index.js'
import options from './options.js'

const MemoryDB = sharedb.MemoryDB

promisifyRacer()

const backend = racer.createBackend({ db: new MemoryDB() })
const model = backend.createModel()

schema(backend, options)

export default model
