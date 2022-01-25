const ShareDbMongo = require('sharedb-mongo')
const MongoClient = require('mongodb').MongoClient
const fs = require('fs')
const isString = require('lodash/isString')
const {
  MONGO_URL,
  MONGO_SSL_KEY_PATH,
  MONGO_SSL_CERT_PATH,
  MONGO_SSL_CA_PATH
} = process.env

let initPromise
let shareMongo

module.exports = async function getShareDbMongo () {
  if (shareMongo) return shareMongo
  if (initPromise) return initPromise

  initPromise = new Promise((resolve, reject) => {
    const mongoOptions = { useUnifiedTopology: true }

    let mongoOpts = process.env.MONGO_OPTS

    if (isString(mongoOpts)) {
      try {
        mongoOpts = JSON.parse(mongoOpts)
      } catch (e) {}
    }

    if (mongoOpts) {
      if (mongoOpts.key) {
        mongoOptions.sslKey = fs.readFileSync(mongoOpts.key)
        mongoOptions.sslCert = fs.readFileSync(mongoOpts.cert)
        mongoOptions.sslCA = fs.readFileSync(mongoOpts.ca)
      }
    } else {
      if (MONGO_SSL_KEY_PATH) {
        mongoOptions.sslKey = fs.readFileSync(MONGO_SSL_KEY_PATH)
        mongoOptions.sslCert = fs.readFileSync(MONGO_SSL_CERT_PATH)
        mongoOptions.sslCA = fs.readFileSync(MONGO_SSL_CA_PATH)
      }
    }

    shareMongo = ShareDbMongo({
      mongo: (callback) => {
        MongoClient.connect(
          MONGO_URL,
          mongoOptions,
          (err, db) => {
            callback(err, db)
            resolve(shareMongo)
          }
        )
      },
      allowAllQueries: true
    })
  })

  return initPromise
}
