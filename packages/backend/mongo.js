import fs from 'fs'
import { MongoClient } from 'mongodb'
import isString from 'lodash/isString.js'

const {
  MONGO_URL,
  MONGO_OPTS,
  MONGO_SSL_KEY_PATH,
  MONGO_SSL_CERT_PATH,
  MONGO_SSL_CA_PATH
} = process.env
const options = { useUnifiedTopology: true }

if (isString(MONGO_OPTS)) {
  const { key, cert, ca } = JSON.parse(MONGO_OPTS)
  options.sslKey = fs.readFileSync(key)
  options.sslCert = fs.readFileSync(cert)
  options.sslCA = fs.readFileSync(ca)
} else if (MONGO_SSL_KEY_PATH) {
  options.sslKey = fs.readFileSync(MONGO_SSL_KEY_PATH)
  options.sslCert = fs.readFileSync(MONGO_SSL_CERT_PATH)
  options.sslCA = fs.readFileSync(MONGO_SSL_CA_PATH)
}

const mongoClient = new MongoClient(MONGO_URL, options)
const mongo = mongoClient.db()

function createMongoIndex (collection, keys, options) {
  return mongo.collection(collection).createIndex(keys, options)
}

export { mongo, mongoClient, createMongoIndex }
