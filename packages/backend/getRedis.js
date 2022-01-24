const fs = require('fs')
const Redis = require('ioredis')
const isString = require('lodash/isString')
const { BASE_URL, MONGO_URL } = process.env
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
module.exports = function getRedis () {
  let client
  let observer
  let redisOpts = process.env.REDIS_OPTS

  if (isString(redisOpts)) {
    try {
      redisOpts = JSON.parse(redisOpts)
    } catch (e) {}
  }

  if (redisOpts) {
    let tls = {}
    if (redisOpts.key) {
      tls = {
        key: fs.readFileSync(redisOpts.key),
        cert: fs.readFileSync(redisOpts.cert),
        ca: fs.readFileSync(redisOpts.ca)
      }
    }

    client = new Redis({
      sentinels: redisOpts.sentinels,
      sslPort: redisOpts.ssl_port || '6380',
      tls: tls,
      name: 'mymaster',
      db: redisOpts.db || 0,
      password: redisOpts.password,
      keyPrefix: PREFIX
    })

    observer = new Redis({
      sentinels: redisOpts.sentinels,
      sslPort: redisOpts.ssl_port || '6380',
      tls: tls,
      name: 'mymaster',
      db: redisOpts.db || 0,
      password: redisOpts.password,
      keyPrefix: PREFIX
    })
  } else {
    const REDIS_URL = process.env.REDIS_URL
    client = new Redis(REDIS_URL, { keyPrefix: PREFIX })
    observer = new Redis(REDIS_URL, { keyPrefix: PREFIX })
  }

  return { client, observer, prefix: PREFIX }
}
// ref: https://stackoverflow.com/a/8831937
function simpleNumericHash (source) {
  let hash = 0
  if (source.length === 0) return hash
  for (let i = 0; i < source.length; i++) {
    const char = source.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}
