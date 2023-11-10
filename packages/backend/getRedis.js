const fs = require('fs')
const Redis = require('ioredis')
const isString = require('lodash/isString')
const {
  BASE_URL,
  MONGO_URL,
  REDIS_OPTS,
  REDIS_URL,
  NO_REDIS
} = process.env
// Use prefix for ShareDB's pubsub. This prevents issues with multiple
// projects using the same redis db.
// We use a combination of MONGO_URL and BASE_URL to generate a simple
// hash because together they are going to be unique no matter whether
// it's run on localhost or on the production server.
// ref: https://github.com/share/sharedb/issues/420
const PREFIX = '_' + simpleNumericHash(MONGO_URL + BASE_URL)
/*
  IMPORTANT:
    If you use Redis in your business logic (for example to implement locking with `redlock`)
    you should use `prefix` which is returned by this function for all
    your redis keys and lock keys. This will prevent bugs when you have multiple staging
    apps using the same redis DB.
*/
module.exports = function getRedis (options) {
  let client
  let observer

  if (NO_REDIS) {
    ({ client, observer } = getMockedRedis())
  } else {
    let redisOpts = isString(REDIS_OPTS)
      ? JSON.parse(REDIS_OPTS)
      : undefined

    if (redisOpts) {
      let tls = {}

      if (redisOpts.key) {
        tls = {
          key: fs.readFileSync(redisOpts.key),
          cert: fs.readFileSync(redisOpts.cert),
          ca: fs.readFileSync(redisOpts.ca)
        }
      }

      options = {
        sentinels: redisOpts.sentinels,
        sslPort: redisOpts.ssl_port || '6380',
        tls,
        name: 'mymaster',
        db: redisOpts.db || 0,
        password: redisOpts.password,
        keyPrefix: PREFIX
      }
    }

    if (options) {
      client = new Redis(options)
      observer = new Redis(options)
    } else if (REDIS_URL) {
      client = new Redis(REDIS_URL, { keyPrefix: PREFIX })
      observer = new Redis(REDIS_URL, { keyPrefix: PREFIX })
    } else {
      ({ client, observer } = getMockedRedis())
    }
  }

  return { client, observer, prefix: PREFIX }
}

function getMockedRedis () {
  const Redis = require('ioredis-mock')
  const options = { keyPrefix: PREFIX }
  return { client: new Redis(options), observer: new Redis(options) }
}

// ref: https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0?permalink_comment_id=2694461#gistcomment-2694461
function simpleNumericHash (s) {
  let i, h
  for (i = 0, h = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0
  return h
}
