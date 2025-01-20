import createQueue from './utils/createQueue.js'
import getParam from './utils/getParam.js'
import './utils/maybeSetPluginParamsToEnv.js'

const { queue, queueEvents } = createQueue({ name: getParam('QUEUE_NAME') })
export { queue, queueEvents }
