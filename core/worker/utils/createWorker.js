import { redisPrefix } from 'startupjs/server'
import { Worker } from 'bullmq'
import cloneDeep from 'lodash/cloneDeep.js'
import { AUTO_REMOVE_JOB_OPTIONS, CONCURRENCY } from './constants.js'
import getWorkerRedis from './getWorkerRedis.js'

export default function createWorker ({ name, processJob, options = {} }) {
  return new Worker(
    name,
    processJob,
    {
      prefix: redisPrefix,
      connection: getWorkerRedis(),
      concurrency: CONCURRENCY,
      ...cloneDeep(AUTO_REMOVE_JOB_OPTIONS),
      ...cloneDeep(options)
    }
  )
}
