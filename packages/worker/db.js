import createBackend from '@startupjs/backend'
import BlueBirdModule from 'bluebird'
import racer from 'racer'
import Redlock from 'redlock'

const { Model } = racer
const { promisifyAll } = BlueBirdModule
promisifyAll(Model.prototype)

export const getDbs = async (options) => {
  const { backend, shareMongo, redisClient } = await createBackend(options)

  let redlock = new Redlock([redisClient], {
    driftFactor: 0.01,
    retryCount: 2,
    retryDelay: 10,
    retryJitter: 10
  })

  await shareMongo.mongo.collection('tasks').createIndex({
    status: 1,
    startTime: 1,
    executingTime: 1
  })

  return { backend, shareMongo, redisClient, redlock }
}

export const initBackend = () => {

}
