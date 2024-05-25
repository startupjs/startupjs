import { redis, redlock, Redlock } from './index.js'

export default function maybeFlushRedis () {
  redis.once('connect', _maybeFlushRedis)
}

async function _maybeFlushRedis () {
  // Always flush redis db in development or if a force env flag is specified.
  if (process.env.NODE_ENV !== 'production' || process.env.FORCE_REDIS_FLUSH) {
    await flushRedis()
    return
  }

  // In production we flush redis db once a day using locking in redis itself.
  const ONE_DAY = 1000 * 60 * 60 * 24
  const LOCK_FLUSH_DB_KEY = 'startupjs_service_flushdb'

  try {
    try {
      await redlock.lock(LOCK_FLUSH_DB_KEY, ONE_DAY)
    } catch (err) {
      if (err instanceof Redlock.LockError) {
        console.log('>> No need to do Redis Flush DB yet (lock for one day is still present)')
        return
      } else { throw err }
    }

    console.log('>>> FLUSHING REDIS DB (this should happen only once a day)')
    await flushRedis()

    // Re-lock right away.
    console.log('>>> RE-LOCK REDIS DB FLUSH CHECK (for one day)')
    try {
      await redlock.lock(LOCK_FLUSH_DB_KEY, ONE_DAY)
    } catch (err) {
      console.error('Error while re-locking flushdb redis lock!\n' + err)
    }
  } catch (err) {
    console.error('Error while performing redis DB flushing!\n' + err)
  }
}

function flushRedis () {
  return new Promise(resolve => {
    redis.flushdb((err, didSucceed) => {
      if (err) {
        console.error('Redis flushdb err:', err)
      } else {
        console.log('Redis flushdb success:', didSucceed)
      }
      resolve()
    })
  })
}
