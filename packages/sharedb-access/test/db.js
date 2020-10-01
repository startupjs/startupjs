const MongoClient = require('mongodb').MongoClient
const promisifyRacer = require('@startupjs/orm/lib/promisifyRacer')
const racer = require('racer')
const shareDbMongo = require('sharedb-mongo')

const { Model } = racer

promisifyRacer()

const getDbs = () => {
  let mongoUrl = 'mongodb://localhost:27017/accessTest'
  let mongoOpts = []

  let shareMongo = shareDbMongo(mongoUrl, {
    allowAllQueries: true,
    mongoOptions: { useUnifiedTopology: true }
  })

  let backend = racer.createBackend({ db: shareMongo })

  return { backend, shareMongo }
}

module.exports = {
  getDbs
}
