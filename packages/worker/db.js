import promisifyRacer from '@startupjs/orm/lib/promisifyRacer.js'
import createBackend from '@startupjs/backend'
import Redlock from 'redlock'

promisifyRacer()

export async function getDbs (options) {
  const { backend, shareDbMongo, redisClient } = await createBackend(options)

  const redlock = new Redlock([redisClient], {
    driftFactor: 0.01,
    retryCount: 2,
    retryDelay: 10,
    retryJitter: 10
  })

  await shareDbMongo.mongo.collection('tasks').createIndex({
    status: 1,
    startTime: 1,
    executingTime: 1
  })

  return { backend, shareDbMongo, redisClient, redlock }
}

export const initBackend = () => {

}
