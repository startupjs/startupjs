const isPlainObject = require('lodash/isPlainObject')
const isArray = require('lodash/isArray')
const conf = require('nconf')
const shareDbMongo = require('sharedb-mongo')
const shareDbAccess = require('sharedb-access')
const racerSchema = require('racer-schema')
const shareDbHooks = require('sharedb-hooks')
const redisPubSub = require('sharedb-redis-pubsub')
const racer = require('racer')
const redis = require('redis-url')
const MongoClient = require('mongodb').MongoClient
const fs = require('fs')

// Optional sharedb-ws-pubsub
let wsbusPubSub = null
try {
  require.resolve('sharedb-wsbus-pubsub')
  wsbusPubSub = require('sharedb-wsbus-pubsub')
} catch (e) {}

module.exports = (options) => {
  // ------------------------------------------------------->     storeUse    <#
  if (options.ee != null) options.ee.emit('storeUse', racer)

  // ShareDB Setup
  let mongoUrl = conf.get('MONGO_URL')
  let mongo
  if (process.env.MONGO_SSL_CERT_PATH && process.env.MONGO_SSL_KEY_PATH) {
    let sslCert = fs.readFileSync(process.env.MONGO_SSL_CERT_PATH)
    let sslKey = fs.readFileSync(process.env.MONGO_SSL_KEY_PATH)

    mongo = shareDbMongo({
      mongo: (callback) => {
        MongoClient.connect(mongoUrl, {
          server: {
            sslKey: sslKey,
            sslValidate: false,
            sslCert: sslCert
          },
          allowAllQueries: true
        }, callback)
      }
    })
  } else {
    mongo = shareDbMongo(mongoUrl, {
      allowAllQueries: true
    })
  }

  let backend = (() => {
    // For horizontal scaling, in production, redis is required.
    if (conf.get('REDIS_URL') && !conf.get('NO_REDIS')) {
      let redisClient = redis.connect()
      let redisObserver = redis.connect()

      // Flush redis when starting the app.
      // When running in cluster this should only run on the first instance.
      // Currently only the detection of the first instance of deis.com cluster
      // is supported.
      // TODO: Implement detection of the first instance on kubernetes and azure
      if (options.flushRedis !== false) {
        redisClient.on('connect', () => {
          let [, , , instance] = (process.env.HOSTNAME || '').split('.')
          if (instance == null || instance === '1') {
            redisClient.flushdb((err, didSucceed) => {
              if (err) {
                console.log('Redis flushdb err:', err)
              } else {
                console.log('Redis flushdb success:', didSucceed)
              }
            })
          }
        })
      }

      let pubsub = redisPubSub({
        client: redisClient,
        observer: redisObserver
      })

      return racer.createBackend({
        db: mongo,
        pubsub: pubsub,
        extraDbs: options.extraDbs
      })

    // redis alternative
    } else if (conf.get('WSBUS_URL') && !conf.get('NO_WSBUS')) {
      if (!wsbusPubSub) throw new Error("Please install the 'sharedb-wsbus-pubsub' package to use it")
      let pubsub = wsbusPubSub(conf.get('WSBUS_URL'))

      return racer.createBackend({
        db: mongo,
        pubsub: pubsub,
        extraDbs: options.extraDbs
      })
    // For development
    } else {
      return racer.createBackend({
        db: mongo,
        extraDbs: options.extraDbs
      })
    }
  })()

  backend.use('query', pathQueryMongo)

  if (options.accessControl != null) {
    shareDbAccess(backend, { dontUseOldDocs: true })
  }
  if (options.schema != null) {
    racerSchema(backend, options.schema)
  }
  if (options.hooks != null) {
    shareDbHooks(backend)
    options.hooks(backend)
  }
  if (options.accessControl != null) {
    options.accessControl(backend)
  }

  backend.on('client', (client, reject) => {
    let req = client.upgradeReq
    if (!req) return

    let userId = req.session && req.session.userId
    let userAgent = req.headers && req.headers['user-agent']
    if (!options.silentLogs) console.log('[WS OPENED]:', userId, userAgent)

    client.once('close', () => {
      if (!options.silentLogs) console.log('[WS CLOSED]', userId)
    })
  })

  // ------------------------------------------------------->      backend       <#
  if (options.ee != null) options.ee.emit('backend', backend)

  return { backend, mongo, redis }
}

function pathQueryMongo (request, next) {
  let query = request.query
  if (isPlainObject(query)) return next()
  if (!isArray(query)) query = [ query ]
  request.query = { _id: { $in: query } }
  next()
}
