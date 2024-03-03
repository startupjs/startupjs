import ShareDbAccess, {
  registerOrmRules,
  rigisterOrmRulesFromFactory
} from '@startupjs/sharedb-access'
import sharedbSchema from '@startupjs/sharedb-schema'
import serverAggregate from '@startupjs/server-aggregate'
import { ROOT_MODULE as MODULE } from '@startupjs/registry'
import isArray from 'lodash/isArray.js'
import isPlainObject from 'lodash/isPlainObject.js'
import racer from 'racer'
import shareDbHooks from 'sharedb-hooks'
import { pubsub } from './redis/index.js'
import { db } from './db/index.js'
import maybeFlushRedis from './redis/maybeFlushRedis.js'

export { redis, redlock, Redlock } from './redis/index.js'
export { db, mongo, mongoClient, createMongoIndex, sqlite } from './db/index.js'

const usersConnectionCounter = {}
global.__clients = {}

export default options => {
  options = Object.assign({ secure: true }, options)

  if (options.ee != null) options.ee.emit('storeUse', racer)

  // pollDebounce is the minimum time in ms between query polls in sharedb
  if (options.pollDebounce) db.pollDebounce = options.pollDebounce

  // Maybe flush redis when starting the app.
  // When running in cluster this should only run on one instance and once a day
  // so redlock is used to guarantee that.
  if (options.flushRedis !== false) maybeFlushRedis()

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

    for (const modelPattern in MODULE.models) {
      let { schema, factory } = MODULE.models[modelPattern]

      if (factory) {
        // TODO: implement getting schema from factory
        // schemaPerCollection.schemas[modelPattern.replace('.*', '')] = ORM[path].OrmEntity
        throw Error('factory model: NOT IMPLEMENTED')
      } else if (schema) {
        const collectionName = modelPattern.replace('.*', '')
        // transform schema from simplified format to full format
        schema = transformSchema(schema, { collectionName })
        schemaPerCollection.schemas[collectionName] = schema
      }

      // allow any 'service' collection structure
      // since 'service' collection is used in our startupjs libraries
      // and we don't have a tool to collect scheme from all packages right now
      schemaPerCollection.schemas.service = transformSchema({
        type: 'object', properties: {}, additionalProperties: true
      })
    }

    sharedbSchema(backend, schemaPerCollection)
    console.log('sharedb-schema is working')
  }

  backend.on('client', (client, reject) => {
    const req = client.upgradeReq
    if (!req) return

    const userId = client.session?.userId || req.session?.userId

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

// allow schema to be specified in a simplified format - as "properties" themselves
// and also with 'required' being part of each property
function transformSchema (schema, { collectionName } = {}) {
  schema = JSON.parse(JSON.stringify(schema))
  // if schema is not an object, assume it's in a simplified format
  if (schema.type !== 'object') {
    schema = {
      type: 'object',
      properties: schema,
      required: Object.keys(schema).filter(
        // gather all required fields
        // (only if explicitly set to a boolean `true` to not interfere with object's 'required' array)
        key => schema[key] && schema[key].required === true
      ),
      additionalProperties: false
    }
  }
  stripExtraUiKeywords(schema)
  schema = MODULE.reduceHook('transformSchema', schema, { collectionName })
  return schema
}

// traverse type 'object' and type 'array' recursively
// and remove extra keywords (like a boolean 'require') from all objects in schema
// WARNING: this is self-mutating
function stripExtraUiKeywords (schema) {
  if (schema.type === 'object') {
    for (const key in schema.properties) {
      const property = schema.properties[key]
      if (isPlainObject(property)) {
        if (typeof property.required === 'boolean') delete property.required
        stripExtraUiKeywords(property)
      }
    }
  } else if (schema.type === 'array') {
    stripExtraUiKeywords(schema.items)
  }
}
