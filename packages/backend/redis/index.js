import { readFileSync } from 'fs'
import Redis from 'ioredis'
import RedisMock from 'ioredis-mock'
import Redlock from 'redlock'
import redisPubSub from 'sharedb-redis-pubsub'

export const {
  redis,
  redisObserver
} = getUniversalRedis({
  disableRedis: process.env.NO_REDIS,
  redisOpts: process.env.REDIS_OPTS,
  redisUrl: process.env.REDIS_URL,
  keyPrefix: generatePrefix({
    mongoUrl: process.env.MONGO_URL,
    baseUrl: process.env.BASE_URL
  })
})

export const pubsub = redisPubSub({
  client: redis,
  observer: redisObserver
})

export const redlock = getRedlock(redis)

export { Redlock }

function getUniversalRedis ({ disableRedis, redisOpts, redisUrl, keyPrefix }) {
  if (!disableRedis) {
    if (typeof redisOpts === 'string') {
      redisOpts = JSON.parse(redisOpts)
      let tls = {}

      if (redisOpts.key) {
        tls = {
          key: readFileSync(redisOpts.key),
          cert: readFileSync(redisOpts.cert),
          ca: readFileSync(redisOpts.ca)
        }
      }

      const options = {
        sentinels: redisOpts.sentinels,
        sslPort: redisOpts.ssl_port || '6380',
        tls,
        name: 'mymaster',
        db: redisOpts.db || 0,
        password: redisOpts.password,
        keyPrefix
      }

      return {
        redis: new Redis(options),
        redisObserver: new Redis(options)
      }
    } else if (redisUrl) {
      return {
        redis: new Redis(redisUrl, { keyPrefix }),
        redisObserver: new Redis(redisUrl, { keyPrefix })
      }
    }
  }
  return {
    redis: new RedisMock({ keyPrefix }),
    redisObserver: new RedisMock({ keyPrefix })
  }
}

function getRedlock (redis) {
  return new Redlock([redis], {
    driftFactor: 0.01,
    retryCount: 2,
    retryDelay: 10,
    retryJitter: 10
  })
}

// Use prefix for ShareDB's pubsub. This prevents issues with multiple
// projects using the same redis db.
// We use a combination of MONGO_URL and BASE_URL to generate a simple
// hash because together they are going to be unique no matter whether
// it's run on localhost or on the production server.
// ref: https://github.com/share/sharedb/issues/420
function generatePrefix ({ mongoUrl, baseUrl }) {
  return '_' + simpleNumericHash('' + mongoUrl + baseUrl)
}

// ref: https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0?permalink_comment_id=2694461#gistcomment-2694461
function simpleNumericHash (s) {
  let i, h
  for (i = 0, h = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0
  return h
}
