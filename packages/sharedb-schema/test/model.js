const MemoryDB = require('sharedb').MemoryDB
const racer = require('racer')
const { default: promisifyRacer } = require('../temp/promisifyRacer')

const racerSchema = require('../lib')
const racerSchemaOptions = require('./options')

promisifyRacer()

const backend = racer.createBackend({ db: new MemoryDB() })
const model = backend.createModel()

racerSchema(backend, racerSchemaOptions)

module.exports = model
