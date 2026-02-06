import { isBackendInitialized } from 'startupjs/server'
import { ensureBackendReady, getJobsMap, getRuntimeOptions } from './runtime.js'

export default async function processJob (job) {
  const data = job.data || {}
  const type = data.type

  if (!type) {
    const message = '[@startupjs/worker] processJob: missing "type" in job data'
    await writeJobLog(job, message, 'error')
    throw new Error(message)
  }

  const jobs = await getJobsMap()
  const jobDefinition = jobs.get(type)

  if (!jobDefinition) {
    const message = `[@startupjs/worker] processJob: job "${type}" not found`
    await writeJobLog(job, message, 'error')
    throw new Error(message)
  }

  const { useSeparateProcess, jobTimeout: defaultTimeout } = getRuntimeOptions()
  if (useSeparateProcess || !isBackendInitialized()) {
    await ensureBackendReady()
  }

  const timeout = toNumber(data.timeout, defaultTimeout)
  const log = createJobLog(job)

  try {
    return await runWithTimeout({
      timeout,
      type,
      execute: () => Promise.resolve(jobDefinition.handler(data, { log, job }))
    })
  } catch (error) {
    await writeJobLog(job, `[${type}] ${formatError(error)}`, 'error')
    throw error
  }
}

function createJobLog (job) {
  const log = async (message, params = {}) => {
    const {
      data,
      err,
      consoleMethod = 'log'
    } = params

    let serializedMessage = stringify(message)
    if (data !== undefined) serializedMessage += ` ${stringify(data)}`
    if (err != null) serializedMessage += ` ${formatError(err)}`

    await writeJobLog(job, serializedMessage, consoleMethod)
  }

  log.error = (message, params = {}) => log(message, { ...params, consoleMethod: 'error' })
  log.warn = (message, params = {}) => log(message, { ...params, consoleMethod: 'warn' })

  return log
}

async function runWithTimeout ({ timeout, type, execute }) {
  if (!Number.isFinite(timeout) || timeout <= 0) {
    return await execute()
  }

  return await Promise.race([
    execute(),
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error(`[@startupjs/worker] Job "${type}" timed out after ${timeout}ms`))
      }, timeout)
    })
  ])
}

async function writeJobLog (job, message, consoleMethod = 'log') {
  await job.log(message)
  const logger = console[consoleMethod] || console.log
  logger(message)
}

function stringify (value) {
  if (typeof value === 'string') return value
  if (value instanceof Error) return value.toString()

  try {
    return JSON.stringify(value)
  } catch (error) {
    return String(value)
  }
}

function formatError (error) {
  if (error instanceof Error) return error.stack || error.message
  return stringify(error)
}

function toNumber (value, fallback) {
  if (value == null) return fallback
  const normalizedValue = Number(value)
  return Number.isFinite(normalizedValue) ? normalizedValue : fallback
}
