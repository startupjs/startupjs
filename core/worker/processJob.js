import { isBackendInitialized } from 'startupjs/server'
import { ensureBackendReady, getJobsMap, getRuntimeOptions } from './runtime.js'
import { createJobRef } from './jobRef.js'
import { enqueueJob, getJobStatus, waitJob } from './jobApi.js'

export default async function processJob (job) {
  const payload = job.data || {}
  const type = payload.type

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

  const {
    ensureBackend,
    useSeparateProcess,
    jobTimeout: defaultTimeout
  } = getRuntimeOptions()
  if (ensureBackend && (useSeparateProcess || !isBackendInitialized())) {
    await ensureBackendReady()
  }

  const timeout = toNumber(payload.timeout, defaultTimeout)
  const data = payload.data
  const worker = payload.meta?.worker || job.queueName || jobDefinition.worker
  const jobRef = {
    ...createJobRef(job, worker),
    name: type
  }
  const log = createJobLog(job)
  const progress = async value => {
    await job.updateProgress(value)
  }

  try {
    return await runWithTimeout({
      timeout,
      type,
      execute: () => Promise.resolve(jobDefinition.handler(data, {
        log,
        job,
        jobRef,
        progress,
        enqueueJob,
        waitJob,
        getJobStatus
      }))
    })
  } catch (error) {
    await writeJobLog(job, `[${type}] ${formatError(error)}`, 'error')

    // In sandbox mode we can hard-stop a hanging job by terminating this
    // worker runner (thread/process) after reporting the failure.
    if (useSeparateProcess && error instanceof JobTimeoutError) {
      setImmediate(() => process.exit(1))
    }

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

  let timeoutId

  try {
    return await Promise.race([
      execute(),
      new Promise((resolve, reject) => {
        timeoutId = setTimeout(() => {
          timeoutId = undefined
          reject(new JobTimeoutError(type, timeout))
        }, timeout)
      })
    ])
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
}

class JobTimeoutError extends Error {
  constructor (type, timeout) {
    super(`[@startupjs/worker] Job "${type}" timed out after ${timeout}ms`)
    this.name = 'JobTimeoutError'
    this.type = type
    this.timeout = timeout
  }
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
  } catch {
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
