import { redisPrefix } from 'startupjs/server'
import { Queue, QueueEvents } from 'bullmq'
import cloneDeep from 'lodash/cloneDeep.js'
import getQueueRedis from './getQueueRedis.js'

export default function createQueue ({ name, options = {} }) {
  const optionsCopy = cloneDeep(options)

  return {
    queue: new Queue(
      name,
      {
        prefix: redisPrefix,
        connection: getQueueRedis(),
        ...optionsCopy
      }
    ),
    queueEvents: new QueueEvents(
      name,
      {
        prefix: redisPrefix,
        connection: getQueueRedis(),
        ...optionsCopy
      }
    )
  }
}
