import { redisPrefix } from 'startupjs/server'
import { Queue, QueueEvents } from 'bullmq'
import cloneDeep from 'lodash/cloneDeep.js'
import getQueueRedis from './getQueueRedis.js'

export default function createQueue ({ name, options = {} }) {
  const optionsCopy = cloneDeep(options)
  const connection = getQueueRedis()

  return {
    queue: new Queue(
      name,
      {
        prefix: redisPrefix,
        connection,
        ...optionsCopy
      }
    ),
    queueEvents: new QueueEvents(
      name,
      {
        prefix: redisPrefix,
        connection,
        ...optionsCopy
      }
    )
  }
}
