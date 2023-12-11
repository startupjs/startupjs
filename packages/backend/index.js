import ShareDbAccess, {
  registerOrmRules,
  rigisterOrmRulesFromFactory
} from '@startupjs/sharedb-access'
import sharedbSchema from '@startupjs/sharedb-schema'
import serverAggregate from '@startupjs/server-aggregate'
import isArray from 'lodash/isArray.js'
import isPlainObject from 'lodash/isPlainObject.js'
import redisPubSub from 'sharedb-redis-pubsub'
import racer from 'racer'
import Redlock from 'redlock'
import shareDbHooks from 'sharedb-hooks'
import db from './db.js'
import { redisClient, redisObserver, redisLock } from './redis.js'

const usersConnectionCounter = {}

global.__clients = {}

export * from './db.js'
export {
  db,
  redisClient,
  redisObserver,
  redisLock
}

export default async options => {
  options = Object.assign({ secure: true }, options)

  if (options.ee != null) options.ee.emit('storeUse', racer)

  // pollDebounce is the minimum time in ms between query polls in sharedb
  if (options.pollDebounce) db.pollDebounce = options.pollDebounce

  // Flush redis when starting the app.
  // When running in cluster this should only run on the first instance.
  // Currently only the detection of the first instance of deis.com cluster
  // is supported.
  // TODO: Implement detection of the first instance on kubernetes and azure
  if (options.flushRedis !== false) {
    const flushRedis = () => {
      return new Promise(resolve => {
        redisClient.flushdb((err, didSucceed) => {
          if (err) {
            console.error('Redis flushdb err:', err)
          } else {
            console.log('Redis flushdb success:', didSucceed)
          }
          resolve()
        })
      })
    }

    redisClient.on('connect', () => {
      // Always flush redis db in development or if a force env flag is specified.
      if (process.env.NODE_ENV !== 'production' || process.env.FORCE_REDIS_FLUSH) {
        flushRedis()
        return
      }
      // In production we flush redis db once a day using locking in redis itself.
      const redlock = new Redlock([redisClient], {
        driftFactor: 0.01,
        retryCount: 0
      })
      const ONE_DAY = 1000 * 60 * 60 * 24
      const LOCK_FLUSH_DB_KEY = 'startupjs_service_flushdb'
      redlock.lock(LOCK_FLUSH_DB_KEY, ONE_DAY)
        .then(() => {
          console.log('>>> FLUSHING REDIS DB (this should happen only once a day)')
          return flushRedis()
        })
        .then(() => {
          // Re-lock right away.
          console.log('>>> RE-LOCK REDIS DB FLUSH CHECK (for one day)')
          redlock.lock(LOCK_FLUSH_DB_KEY, ONE_DAY)
            .catch(err => console.error('Error while re-locking flushdb redis lock!\n' + err))
        })
        .catch(err => {
          if (err instanceof Redlock.LockError) {
            console.log('>> No need to do Redis Flush DB yet (lock for one day is still present)')
          } else {
            console.error('Error while checking flushdb redis lock!\n' + err)
          }
        })
    })
  }

  const pubsub = redisPubSub({
    client: redisClient,
    observer: redisObserver
  })

  const backend = racer.createBackend({
    db,
    pubsub,
    extraDbs: options.extraDbs
  })

  backend.use('query', pathQueryMongo)

  // Monkey patch racer's model creation
  const oldCreateModel = backend.createModel
  backend.createModel = function (options = {}, req) {
    return oldCreateModel.call(backend, { fetchOnly: true, ...options }, req)
  }

  // sharedb-hooks
  shareDbHooks(backend)

  if (options.hooks != null) options.hooks(backend)

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

      for (const aggregationKey in aggregations) {
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
    const req = client.upgradeReq
    if (!req) return

    const userId = req.session && req.session.userId

    if (!global.__clients[userId]) {
      const model = backend.createModel()
      global.__clients[userId] = { model }
    }

    usersConnectionCounter[userId] = ~~usersConnectionCounter[userId] + 1

    const userAgent = req.headers && req.headers['user-agent']
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

  if (options.ee != null) options.ee.emit('backend', backend)

  return backend
}

function pathQueryMongo (request, next) {
  let query = request.query
  if (isPlainObject(query)) return next()
  if (!isArray(query)) query = [query]
  request.query = { _id: { $in: query } }
  next()
}
