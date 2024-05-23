import ShareDbAccess, {
  registerOrmRules
} from '@startupjs/sharedb-access'
import ShareDB from 'sharedb'
import shareDbHooks from 'sharedb-hooks'
import { pubsub } from './redis/index.js'
import { db } from './db/index.js'
import maybeFlushRedis from './redis/maybeFlushRedis.js'
import validateSchema from './features/validateSchema.js'
import serverAggregate from './features/serverAggregate.js'

export { redis, redlock, Redlock } from './redis/index.js'
export { db, mongo, mongoClient, createMongoIndex, sqlite } from './db/index.js'

const usersConnectionCounter = {}
global.__clients = {}

export default function createBackend (options) {
  options = Object.assign({ secure: true }, options)

  // pollDebounce is the minimum time in ms between query polls in sharedb
  if (options.pollDebounce) db.pollDebounce = options.pollDebounce

  // Maybe flush redis when starting the app.
  // When running in cluster this should only run on one instance and once a day
  // so redlock is used to guarantee that.
  if (options.flushRedis !== false) maybeFlushRedis()

  const backend = new ShareDB({
    db,
    pubsub,
    extraDbs: options.extraDbs
  })

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

      // TODO:
      //   - move registerOrmRulesFromFactory and registerOrmRules to this library
      //   - rewrite factories check to not use model anymore
      if (isFactory) {
        throw Error('Sharedb-access does not support ORM factories yet')
        // registerOrmRulesFromFactory(backend, path, ormEntity)
      } else if (access) {
        registerOrmRules(backend, path, access)
      }
    }

    console.log('sharedb-access is working')
  }

  if (options.secure || options.serverAggregate) {
    serverAggregate(backend, { customCheck: options.serverAggregate?.customCheck })
  }

  if ((options.secure || options.validateSchema) && process.env.NODE_ENV !== 'production') {
    validateSchema(backend)
  }

  backend.on('client', (client, reject) => {
    const req = client.upgradeReq
    if (!req) return

    const userId = client.session?.userId || req.session?.userId

    // TODO: rewrite to use $ here, or create a separate root $ for each user
    // if (!global.__clients[userId]) {
    //   const model = backend.createModel()
    //   global.__clients[userId] = { model }
    // }

    usersConnectionCounter[userId] = ~~usersConnectionCounter[userId] + 1

    const userAgent = req.headers && req.headers['user-agent']
    if (!options.silentLogs) console.log('[WS OPENED]:', userId, userAgent)

    client.once('close', () => {
      if (!options.silentLogs) console.log('[WS CLOSED]', userId)

      usersConnectionCounter[userId] -= 1

      // TODO: rewrite to use $ here, or create a separate root $ for each user
      // if (usersConnectionCounter[userId] <= 0) {
      //   global.__clients[userId].model.close()
      //   delete global.__clients[userId]
      // }
    })
  })

  if (options.ee != null) options.ee.emit('backend', backend)

  return backend
}
