import { getAction } from '../actions.js'
import getParam from './getParam.js'
import { getWrappedLog, log } from './log.js'
import TimeoutError from './TimeoutError.js'
import { setJobTimeout, maybeClearJobTimeout } from './timeouts.js'

export default async function processJob (job) {
  const data = job.data
  const type = data.type
  const action = await getAction(type)

  if (!action) {
    const message = `[@startupjs/worker] processJob: "${type}" job not found`
    await log({ job, message, consoleMethod: 'error' })
    throw new Error(message)
  }

  const jobTimeout = data.timeout || getParam('JOB_TIMEOUT')

  try {
    const result = await Promise.race([
      _processJob({ job, action, data }),
      new Promise((resolve, reject) => {
        const timeoutId = setTimeout(async () => {
          reject(new TimeoutError({ jobId: job.id, jobType: type, jobTimeout }))
        }, jobTimeout)
        setJobTimeout(job.id, timeoutId)
      })
    ])

    maybeClearJobTimeout(job.id)

    return result
  } catch (err) {
    maybeClearJobTimeout(job.id)
    if (getParam('USE_SEPARATE_PROCESS') && err instanceof TimeoutError) {
      process.exit(1)
    }
    let message = ''

    const errorString = err.toString()
    if (!errorString.includes(type)) message += `[${type}]:`

    await log({ job, message, consoleMethod: 'error', err })

    // append errorString after log call - it does the same thing inside
    message += ` ${errorString}`
    if (message) {
      throw new Error(message, { cause: err })
    } else {
      throw err
    }
  }
}

async function _processJob ({ job, action, data }) {
  const actionResult = action(data, { log: getWrappedLog(job), job })
  let result
  if (actionResult.then) {
    result = await actionResult
  } else {
    result = actionResult
  }
  return result
}
