import { getRedis, getRedisOptions } from 'startupjs/server'
import cloneDeep from 'lodash/cloneDeep.js'

export default function getQueueRedis () {
  return getRedis({
    ...cloneDeep(getRedisOptions({ addPrefix: false })),
    maxRetriesPerRequest: null,
    enableOfflineQueue: false
  })
}
