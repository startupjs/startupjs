import fs from 'fs'
import isString from 'lodash/isString.js'
import mongoPkg from 'mongodb'
import bluebirdPkg from 'bluebird'
import racer from 'racer'
import Redis from 'ioredis'
import redisPubSub from 'sharedb-redis-pubsub'
import Redlock from 'redlock'
import shareDbMongo from 'sharedb-mongo'

const { MongoClient } = mongoPkg
const { promisifyAll } = bluebirdPkg
const { Model } = racer
const ROOT_PATH = process.cwd()

promisifyAll(Model.prototype)

export const getDbs = () => {
  let mongoUrl = process.env.MONGO_URL
  let mongoOpts = process.env.MONGO_OPTS
  if (isString(mongoOpts)) {
    try {
      mongoOpts = JSON.parse(mongoOpts)
    } catch (e) {}
  }

  let shareMongo

  if (mongoOpts && fs.existsSync(ROOT_PATH + '/config/' + mongoOpts.key)) {
    shareMongo = shareDbMongo({
      mongo: (callback) => {
        MongoClient.connect(mongoUrl, {
          sslKey: fs.readFileSync(ROOT_PATH + '/config/' + mongoOpts.key),
          sslCert: fs.readFileSync(ROOT_PATH + '/config/' + mongoOpts.cert),
          sslCA: fs.readFileSync(ROOT_PATH + '/config/' + mongoOpts.ca)
        }, (...args) => {
          let [err, db] = args
          db.collection('tasks').createIndex({ status: 1, startTime: 1, executingTime: 1 })
          callback(err, db)
        })
      },
      allowAllQueries: true,
      mongoOptions: { useUnifiedTopology: true }
    })
  } else {
    shareMongo = shareMongo = shareDbMongo(mongoUrl, {
      allowAllQueries: true,
      mongoOptions: { useUnifiedTopology: true }
    })
  }

  let redisOpts = process.env.REDIS_OPTS
  if (isString(redisOpts)) {
    try {
      redisOpts = JSON.parse(redisOpts)
    } catch (e) {}
  }

  let redis1
  let redis2

  if (redisOpts) {
    let tls = {}
    if (fs.existsSync(ROOT_PATH + '/config/' + redisOpts.key)) {
      tls = {
        key: fs.readFileSync(ROOT_PATH + '/config/' + redisOpts.key, 'utf8'),
        cert: fs.readFileSync(ROOT_PATH + '/config/' + redisOpts.cert, 'utf8'),
        ca: fs.readFileSync(ROOT_PATH + '/config/' + redisOpts.ca, 'utf8')
      }
    }

    redis1 = new Redis({
      sentinels: redisOpts.sentinels,
      sslPort: redisOpts.ssl_port || '6380',
      tls: tls,
      name: 'mymaster',
      db: redisOpts.db || 0,
      password: redisOpts.password
    })

    redis2 = new Redis({
      sentinels: redisOpts.sentinels,
      sslPort: redisOpts.ssl_port || '6380',
      tls: tls,
      name: 'mymaster',
      db: redisOpts.db || 0,
      password: redisOpts.password
    })
  } else {
    redis1 = new Redis(process.env.REDIS_URL)
    redis2 = new Redis(process.env.REDIS_URL)
  }

  let redlock = new Redlock([redis1], {
    driftFactor: 0.01,
    retryCount: 2,
    retryDelay: 10,
    retryJitter: 10
  })

  let pubsub = redisPubSub({ client: redis1, observer: redis2 })

  // TODO: Refactor this! worker should use @startupjs/backend to create a backend.
  //       AND this implementation of ioredis is actually better, so use ioredis
  //       instead of pure redis for TLS support in @startupjs/backend
  let backend = racer.createBackend({ db: shareMongo, pubsub })

  return { backend, shareMongo, redis1, redis2, redlock }
}

export const initBackend = () => {

}
