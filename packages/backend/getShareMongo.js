const shareDbMongo = require('sharedb-mongo')
const MongoClient = require('mongodb').MongoClient
const fs = require('fs')

let initPromise
let shareMongo
let { MONGO_URL, MONGO_SSL_CERT_PATH, MONGO_SSL_KEY_PATH } = process.env

module.exports = async function getMongo () {
  if (shareMongo) return shareMongo
  if (initPromise) return initPromise

  initPromise = new Promise((resolve, reject) => {
    const options = {}

    if (MONGO_SSL_CERT_PATH && MONGO_SSL_KEY_PATH) {
      options.sslCert = fs.readFileSync(MONGO_SSL_CERT_PATH)
      options.sslKey = fs.readFileSync(MONGO_SSL_KEY_PATH)
    }

    shareMongo = shareDbMongo({
      mongo: (callback) => {
        MongoClient.connect(MONGO_URL, options, (err, db) => {
          callback(err, db)
          resolve(shareMongo)
        })
      },
      allowAllQueries: true
    })
  })

  return initPromise
}
