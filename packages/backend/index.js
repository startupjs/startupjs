const ShareDbAccess = require('@startupjs/sharedb-access')
const registerOrmRules = require('@startupjs/sharedb-access').registerOrmRules
const rigisterOrmRulesFromFactory = require('@startupjs/sharedb-access').rigisterOrmRulesFromFactory
const sharedbSchema = require('@startupjs/sharedb-schema')
const serverAggregate = require('@startupjs/server-aggregate')
const conf = require('nconf')
const isArray = require('lodash/isArray')
const isPlainObject = require('lodash/isPlainObject')
const redisPubSub = require('sharedb-redis-pubsub')
const racer = require('racer')
const redis = require('redis-url')
const shareDbHooks = require('sharedb-hooks')
const getShareMongo = require('./getShareMongo')

global.__clients = {}
const usersConnectionCounter = {}

// Optional sharedb-ws-pubsub
let wsbusPubSub = null
try {
  require.resolve('sharedb-wsbus-pubsub')
  wsbusPubSub = require('sharedb-wsbus-pubsub')
} catch (e) { }

module.exports = async options => {
  options = Object.assign({ secure: true }, options)

  // ------------------------------------------------------->     storeUse    <#
  if (options.ee != null) options.ee.emit('storeUse', racer)

  // ShareDB Setup
  const shareMongo = await getShareMongo()

  if (options.pollDebounce) shareMongo.pollDebounce = options.pollDebounce

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
        db: shareMongo,
        pubsub: pubsub,
        extraDbs: options.extraDbs
      })

      // redis alternative
    } else if (conf.get('WSBUS_URL') && !conf.get('NO_WSBUS')) {
      if (!wsbusPubSub) {
        throw new Error(
          "Please install the 'sharedb-wsbus-pubsub' package to use it"
        )
      }
      let pubsub = wsbusPubSub(conf.get('WSBUS_URL'))

      return racer.createBackend({
        db: shareMongo,
        pubsub: pubsub,
        extraDbs: options.extraDbs
      })
      // For development
    } else {
      return racer.createBackend({
        db: shareMongo,
        extraDbs: options.extraDbs
      })
    }
  })()

  backend.use('query', pathQueryMongo)

  // Monkey patch racer's model creation
  const oldCreateModel = backend.createModel
  backend.createModel = function (options = {}, req) {
    return oldCreateModel.call(backend, { fetchOnly: true, ...options }, req)
  }

  // sharedb-hooks
  shareDbHooks(backend)

  if (options.hooks != null) {
    options.hooks(backend)
  }

  const ORM = global.STARTUP_JS_ORM || {}

  // sharedb-access
  if (options.secure || options.accessControl) {
    // eslint-disable-next-line
    new ShareDbAccess(backend, { dontUseOldDocs: true })

    for (const path in ORM) {
      const ormEntity = ORM[path].OrmEntity

      const { access } = ormEntity
      const isFactory = !!ormEntity.factory

      // TODO
      // move rigisterOrmRulesFromFactory and registerOrmRules to this library
      if (isFactory) {
        rigisterOrmRulesFromFactory(backend, path, ormEntity)
      } else if (access) {
        registerOrmRules(backend, path, access)
      }
    }

    console.log('sharedb-access is working')
  }

  // server aggregate
  if (options.secure || options.serverAggregate) {
    const { customCheck } = options.serverAggregate || {}
    serverAggregate(backend, customCheck)

    for (const path in ORM) {
      const { aggregations } = ORM[path].OrmEntity
      if (!aggregations) continue

      for (let aggregationKey in aggregations) {
        const collection = path.replace(/\.\*$/u, '')
        backend.addAggregate(
          collection,
          aggregationKey,
          (queryParams, shareRequest) => {
            const session = shareRequest.agent.connectSession
            const userId = session.userId
            const model = global.__clients[userId].model
            return aggregations[aggregationKey](model, queryParams, session)
          }
        )
      }
    }

    console.log('server aggregate is working')
  }

  // sharedb-schema
  if (
    (options.secure || options.validateSchema) &&
    process.env.NODE_ENV !== 'production'
  ) {
    const schemaPerCollection = { schemas: {}, formats: {}, validators: {} }

    for (const path in ORM) {
      const { schema } = ORM[path].OrmEntity

      const isFactory = !!ORM[path].OrmEntity.factory

      if (isFactory) {
        schemaPerCollection.schemas[path.replace('.*', '')] = ORM[path].OrmEntity
      } else if (schema) {
        schemaPerCollection.schemas[path.replace('.*', '')] = schema
      }

      // allow any 'service' collection structure
      // since 'service' collection is used in our startupjs libraries
      // and we don't have a tool to collect scheme from all packages right now
      schemaPerCollection.schemas.service = { properties: {} }
    }

    sharedbSchema(backend, schemaPerCollection)
    console.log('sharedb-schema is working')
  }

  backend.on('client', (client, reject) => {
    let req = client.upgradeReq
    if (!req) return

    let userId = req.session && req.session.userId

    if (!global.__clients[userId]) {
      const model = backend.createModel()
      global.__clients[userId] = { model }
    }

    usersConnectionCounter[userId] = ~~usersConnectionCounter[userId] + 1

    let userAgent = req.headers && req.headers['user-agent']
    if (!options.silentLogs) console.log('[WS OPENED]:', userId, userAgent)

    client.once('close', () => {
      if (!options.silentLogs) console.log('[WS CLOSED]', userId)

      usersConnectionCounter[userId] -= 1

      if (usersConnectionCounter[userId] <= 0) {
        global.__clients[userId].model.close()
        delete global.__clients[userId]
      }
    })
  })

  // ------------------------------------------------------->      backend       <#
  if (options.ee != null) {
    options.ee.emit('backend', backend, {
      mongo: shareMongo.mongo
    })
  }

  return { backend, shareMongo, redis }
}

function pathQueryMongo (request, next) {
  let query = request.query
  if (isPlainObject(query)) return next()
  if (!isArray(query)) query = [query]
  request.query = { _id: { $in: query } }
  next()
}
