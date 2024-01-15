import fs from 'fs'
import { MongoClient } from 'mongodb'
import ShareDbMongo from 'sharedb-mongo'

export const { db, mongo, mongoClient, createMongoIndex } = getMongoDb({
  url: process.env.MONGO_URL,
  optsString: process.env.MONGO_OPTS,
  sslKeyPath: process.env.MONGO_SSL_KEY_PATH,
  sslCertPath: process.env.MONGO_SSL_CERT_PATH,
  sslCaPath: process.env.MONGO_SSL_CA_PATH
})

function getMongoDb ({ url, optsString, sslKeyPath, sslCertPath, sslCaPath }) {
  const options = { useUnifiedTopology: true }

  if (typeof optsString === 'string') {
    const { key, cert, ca } = JSON.parse(optsString)
    options.sslKey = fs.readFileSync(key)
    options.sslCert = fs.readFileSync(cert)
    options.sslCA = fs.readFileSync(ca)
  } else if (sslKeyPath) {
    options.sslKey = fs.readFileSync(sslKeyPath)
    options.sslCert = fs.readFileSync(sslCertPath)
    options.sslCA = fs.readFileSync(sslCaPath)
  }

  const mongoClient = new MongoClient(url, options)
  const mongo = mongoClient.db()
  return {
    db: ShareDbMongo({
      mongo: callback => callback(null, mongoClient),
      allowAllQueries: true
    }),
    mongo,
    mongoClient,
    createMongoIndex (collection, keys, options) {
      return mongo.collection(collection).createIndex(keys, options)
    }
  }
}
