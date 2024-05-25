// import promisifyRacer from '@startupjs/orm/lib/promisifyRacer.js'
throw Error('@startupjs/orm does not exist anymore. This module has to be updated to work on the new teamplay library.')
import getBackend, { mongo, redis, redlock } from '@startupjs/backend'

promisifyRacer()

export async function getDbs (options) {
  const backend = await getBackend(options)

  await mongo.collection('tasks').createIndex({
    status: 1,
    startTime: 1,
    executingTime: 1
  })

  return { backend, mongo, redis, redlock }
}

export const initBackend = () => {

}
