import { join } from 'path'
import getParam from './utils/getParam.js'

const ACTIONS = {}

export async function getAction (type) {
  let action = ACTIONS[type]

  // when the job is executed in a separate process the ACTIONS object is empty
  if (!action && getParam('USE_SEPARATE_PROCESS')) {
    const { default: _action } = await import(join(process.cwd(), 'workerJobs', `${type}.js`))
    action = _action
  }

  return action
}

export function setAction (type, action) {
  ACTIONS[type] = action
}
