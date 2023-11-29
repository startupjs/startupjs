import fs from 'fs'
import Redis from 'ioredis'
import isString from 'lodash/isString.js'
import RedisMock from 'ioredis-mock'
import Redlock from 'redlock'

const { BASE_URL, MONGO_URL, REDIS_OPTS, REDIS_URL, NO_REDIS } = process.env

// Use prefix for ShareDB's pubsub. This prevents issues with multiple
// projects using the same redis db.
// We use a combination of MONGO_URL and BASE_URL to generate a simple
// hash because together they are going to be unique no matter whether
// it's run on localhost or on the production server.
// ref: https://github.com/share/sharedb/issues/420
const PREFIX = '_' + simpleNumericHash(MONGO_URL + BASE_URL)
let redisClient
let redisObserver

if (NO_REDIS) {
  ({ redisClient, redisObserver } = getMockedRedis())
} else if (isString(REDIS_OPTS)) {
  const redisOpts = JSON.parse(REDIS_OPTS)
  let tls = {}

  if (redisOpts.key) {
    tls = {
      key: fs.readFileSync(redisOpts.key),
      cert: fs.readFileSync(redisOpts.cert),
      ca: fs.readFileSync(redisOpts.ca)
    }
  }

  const options = {
    sentinels: redisOpts.sentinels,
    sslPort: redisOpts.ssl_port || '6380',
    tls,
    name: 'mymaster',
    db: redisOpts.db || 0,
    password: redisOpts.password,
    keyPrefix: PREFIX
  }

  redisClient = new Redis(options)
  redisObserver = new Redis(options)
} else if (REDIS_URL) {
  redisClient = new Redis(REDIS_URL, { keyPrefix: PREFIX })
  redisObserver = new Redis(REDIS_URL, { keyPrefix: PREFIX })
} else {
  ({ redisClient, redisObserver } = getMockedRedis())
}

const defaultRedlock = new Redlock([redisClient], {
  retryCount: 0
})

function redisLock (key, timeout = 5000, options) {
  const redlock = options
    ? new Redlock([redisClient], options)
    : defaultRedlock
  return redlock.lock(key, timeout)
}

export { redisClient, redisObserver, redisLock }

function getMockedRedis () {
  const options = { keyPrefix: PREFIX }
  return {
    redisClient: new RedisMock(options),
    redisObserver: new RedisMock(options)
  }
}

// ref: https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0?permalink_comment_id=2694461#gistcomment-2694461
function simpleNumericHash (s) {
  let i, h
  for (i = 0, h = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0
  return h
}
