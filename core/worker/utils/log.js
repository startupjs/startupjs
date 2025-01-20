export async function log ({ job, message, data, consoleMethod = 'log', err }) {
  let jobLog = message
  let consoleLog = message
  if (data) {
    jobLog += ` ${JSON.stringify(data)}`
    consoleLog += ` ${JSON.stringify(data)}`
  }
  if (err) {
    jobLog += ` ${err.toString()}`
    consoleLog += ` ${err}`
  }
  await job.log(jobLog)
  console[consoleMethod](consoleLog)
}

export function getWrappedLog (job) {
  return async function wrappedLog (message, params) {
    return log({ job, message, ...params })
  }
}
