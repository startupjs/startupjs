import {
  createBackend,
  getBackend,
  getRedis,
  getRedisOptions,
  isBackendInitialized,
  redisPrefix
} from 'startupjs/server'
import { ROOT_MODULE as MODULE, getPlugin } from '@startupjs/registry'
import { Queue, QueueEvents } from 'bullmq'
import { existsSync, readdirSync } from 'fs'
import { basename, extname, join } from 'path'
import { pathToFileURL } from 'url'

const DAY_IN_MS = 24 * 60 * 60 * 1000

export const AVAILABLE_WORKERS = Object.freeze(['default', 'priority'])

const DEFAULT_OPTIONS = {
  concurrency: 300,
  ensureBackend: true,
  useSeparateProcess: false,
  useWorkerThreads: true,
  jobTimeout: 30000,
  queuePrefix: redisPrefix,
  events: undefined
}

const DEFAULT_JOB_OPTIONS = {
  removeOnComplete: { age: DAY_IN_MS },
  removeOnFail: { age: DAY_IN_MS }
}

const queues = new Map()
const queueEvents = new Map()
const redisConnections = new Set()
const pendingWorkerEvents = new Set()

let backendInitPromise
let workerBackend
let jobsPromise
let runtimeOptionsOverrides = {}

export function getRuntimeOptions (override = {}) {
  const plugin = getPlugin('worker')
  const pluginOptions = plugin?.initialized
    ? (plugin.optionsByEnv?.server || {})
    : {}
  const mergedOptions = {
    ...pluginOptions,
    ...runtimeOptionsOverrides,
    ...override
  }

  return {
    concurrency: toNumber(mergedOptions.concurrency, DEFAULT_OPTIONS.concurrency),
    ensureBackend: toBoolean(mergedOptions.ensureBackend, DEFAULT_OPTIONS.ensureBackend),
    useSeparateProcess: toBoolean(
      mergedOptions.useSeparateProcess,
      DEFAULT_OPTIONS.useSeparateProcess
    ),
    useWorkerThreads: toBoolean(
      mergedOptions.useWorkerThreads,
      DEFAULT_OPTIONS.useWorkerThreads
    ),
    jobTimeout: toNumber(mergedOptions.jobTimeout, DEFAULT_OPTIONS.jobTimeout),
    queuePrefix: normalizeQueuePrefix(mergedOptions.queuePrefix, DEFAULT_OPTIONS.queuePrefix),
    events: normalizeEvents(mergedOptions.events)
  }
}

export function setRuntimeOptionsOverrides (override = {}) {
  if (!override || typeof override !== 'object') return
  runtimeOptionsOverrides = {
    ...runtimeOptionsOverrides,
    ...override
  }
}

export function getWorkersToStart (workers) {
  if (workers != null) return normalizeWorkers(workers)

  const rawWorkers = process.env.WORKERS
  if (!rawWorkers) return AVAILABLE_WORKERS.slice()

  const parsedWorkers = rawWorkers
    .split(',')
    .map(worker => worker.trim())
    .filter(Boolean)

  if (!parsedWorkers.length) {
    throw new Error(
      `[@startupjs/worker] WORKERS env var is empty. Available workers: ${AVAILABLE_WORKERS.join(', ')}`
    )
  }

  return normalizeWorkers(parsedWorkers)
}

export function getQueue (queueName) {
  validateWorkerName(queueName)
  const queuePrefix = getRuntimeOptions().queuePrefix
  const queueKey = `${queuePrefix}:${queueName}`

  if (!queues.has(queueKey)) {
    queues.set(queueKey, new Queue(queueName, {
      prefix: queuePrefix,
      connection: createQueueConnection()
    }))
  }

  return queues.get(queueKey)
}

export function getQueueEvents (queueName) {
  validateWorkerName(queueName)
  const queuePrefix = getRuntimeOptions().queuePrefix
  const queueKey = `${queuePrefix}:${queueName}`

  if (!queueEvents.has(queueKey)) {
    const queueEventsInstance = new QueueEvents(queueName, {
      prefix: queuePrefix,
      connection: createQueueConnection()
    })

    // Multiple concurrent runJob().waitUntilFinished() calls attach listeners to
    // the same QueueEvents instance, which can exceed Node's default of 10.
    queueEventsInstance.setMaxListeners(0)
    queueEvents.set(queueKey, queueEventsInstance)
  }

  return queueEvents.get(queueKey)
}

export function getQueueJobOptions () {
  return {
    removeOnComplete: { ...DEFAULT_JOB_OPTIONS.removeOnComplete },
    removeOnFail: { ...DEFAULT_JOB_OPTIONS.removeOnFail }
  }
}

export async function closeRuntimeResources () {
  await flushWorkerEvents()

  const queuesToClose = Array.from(queues.values())
  const queueEventsToClose = Array.from(queueEvents.values())

  queues.clear()
  queueEvents.clear()

  await Promise.allSettled([
    ...queuesToClose.map(queue => queue.close()),
    ...queueEventsToClose.map(events => events.close())
  ])

  const connectionsToClose = Array.from(redisConnections.values())
  redisConnections.clear()

  await Promise.allSettled(connectionsToClose.map(closeRedisConnection))
}

export function getWorkerConnection () {
  return createRedisConnection({
    ...getRedisOptions({ addPrefix: false }),
    maxRetriesPerRequest: null
  })
}

export async function ensureBackendReady () {
  if (workerBackend) return
  if (isBackendInitialized()) {
    workerBackend = getBackend()
    return
  }
  if (backendInitPromise) {
    await backendInitPromise
    return
  }

  backendInitPromise = Promise.resolve()
    .then(() => {
      workerBackend = createBackend()
    })
    .catch(error => {
      backendInitPromise = undefined
      throw error
    })

  await backendInitPromise
}

export function getWorkerBackend () {
  if (workerBackend) return workerBackend

  throw new Error(
    '[@startupjs/worker] Worker backend is not available. ' +
      'Enable backend initialization for the worker process before using job context backend/createModel.'
  )
}

export function createWorkerModel () {
  return getWorkerBackend().createModel()
}

export async function emitWorkerEvent (eventName, event = {}) {
  const promise = runWorkerEvent(eventName, event)

  pendingWorkerEvents.add(promise)
  promise.finally(() => {
    pendingWorkerEvents.delete(promise)
  })

  return await promise
}

async function runWorkerEvent (eventName, event = {}) {
  const events = getRuntimeOptions().events
  const handlerName = getWorkerEventHandlerName(eventName)
  const handler = events?.[handlerName]

  if (typeof handler !== 'function') return

  try {
    await handler(event)
  } catch (error) {
    console.error(`[@startupjs/worker] ${handlerName} hook failed:`, error)
  }
}

async function flushWorkerEvents () {
  if (!pendingWorkerEvents.size) return

  await Promise.allSettled(Array.from(pendingWorkerEvents))
}

export async function getJobsMap ({ refresh = false } = {}) {
  if (refresh || !jobsPromise) jobsPromise = loadJobs()
  return jobsPromise
}

function createQueueConnection () {
  return createRedisConnection({
    ...getRedisOptions({ addPrefix: false }),
    maxRetriesPerRequest: null,
    enableOfflineQueue: false
  })
}

function createRedisConnection (options) {
  const connection = getRedis(options)
  redisConnections.add(connection)
  return connection
}

async function closeRedisConnection (connection) {
  await connection.quit().catch(() => {
    connection.disconnect()
  })
}

function normalizeWorkers (workers) {
  const list = Array.isArray(workers) ? workers : [workers]
  const normalizedWorkers = []

  for (const workerName of list) {
    if (typeof workerName !== 'string') {
      throw new Error(
        `[@startupjs/worker] Invalid worker name type: ${typeof workerName}. ` +
          `Available workers: ${AVAILABLE_WORKERS.join(', ')}`
      )
    }

    const normalizedName = workerName.trim()
    validateWorkerName(normalizedName)

    if (!normalizedWorkers.includes(normalizedName)) {
      normalizedWorkers.push(normalizedName)
    }
  }

  return normalizedWorkers
}

function validateWorkerName (workerName) {
  if (AVAILABLE_WORKERS.includes(workerName)) return

  throw new Error(
    `[@startupjs/worker] Unknown worker "${workerName}". ` +
      `Available workers: ${AVAILABLE_WORKERS.join(', ')}`
  )
}

async function loadJobs () {
  const jobsFromFiles = await loadJobsFromFiles()
  let jobs = { ...jobsFromFiles }

  try {
    const reducedJobs = await Promise.resolve(MODULE.reduceHook('workerJobs', jobs))
    if (reducedJobs && typeof reducedJobs === 'object') jobs = reducedJobs
  } catch (error) {
    console.error('[@startupjs/worker] Failed to collect worker jobs from plugins:', error)
  }

  const jobsMap = new Map()

  for (const [jobName, value] of Object.entries(jobs)) {
    if (value == null) continue

    const jobModule = await Promise.resolve(value)
    if (!jobModule || typeof jobModule !== 'object') {
      throw new Error(`[@startupjs/worker] Job "${jobName}" must be an object module`)
    }
    if (typeof jobModule.default !== 'function') {
      throw new Error(`[@startupjs/worker] Job "${jobName}" must export default function`)
    }

    jobsMap.set(jobName, normalizeJob(jobName, jobModule))
  }

  return jobsMap
}

async function loadJobsFromFiles () {
  const jobsDir = join(process.cwd(), 'workerJobs')
  if (!existsSync(jobsDir)) return {}

  const jobs = {}
  const entries = readdirSync(jobsDir, { withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isFile()) continue

    const extension = extname(entry.name)
    if (!['.js', '.mjs', '.cjs'].includes(extension)) continue

    const jobName = basename(entry.name, extension)
    const filePath = join(jobsDir, entry.name)
    jobs[jobName] = await import(pathToFileURL(filePath).href)
  }

  return jobs
}

function normalizeJob (jobName, jobModule) {
  const workerName = jobModule.worker ?? 'default'
  validateWorkerName(workerName)

  const cron = normalizeCron(jobName, jobModule.cron)
  const singleton = normalizeSingleton(jobName, jobModule.singleton)

  return {
    name: jobName,
    handler: jobModule.default,
    worker: workerName,
    cron,
    singleton
  }
}

function normalizeCron (jobName, cron) {
  if (cron == null) return undefined

  if (typeof cron === 'string') {
    return {
      pattern: cron,
      data: {}
    }
  }

  if (typeof cron !== 'object' || typeof cron.pattern !== 'string') {
    throw new Error(
      `[@startupjs/worker] Job "${jobName}" has invalid cron export. ` +
        'Use a cron pattern string or object: { pattern, data }'
    )
  }

  if (Object.prototype.hasOwnProperty.call(cron, 'jobData')) {
    throw new Error(
      `[@startupjs/worker] Job "${jobName}" uses deprecated cron.jobData. ` +
        'Use cron.data instead'
    )
  }

  const data = Object.prototype.hasOwnProperty.call(cron, 'data')
    ? cron.data
    : {}

  return {
    pattern: cron.pattern,
    data
  }
}

function normalizeSingleton (jobName, singleton) {
  if (singleton == null) return undefined
  if (singleton === true || singleton === false) return singleton
  if (typeof singleton === 'function') return singleton

  throw new Error(
    `[@startupjs/worker] Job "${jobName}" has invalid singleton export. ` +
      'Use true, false or a function'
  )
}

function toBoolean (value, defaultValue) {
  if (value == null) return defaultValue
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    if (value === 'true') return true
    if (value === 'false') return false
  }
  return Boolean(value)
}

function toNumber (value, defaultValue) {
  if (value == null) return defaultValue
  const normalizedValue = Number(value)
  return Number.isFinite(normalizedValue) ? normalizedValue : defaultValue
}

function normalizeQueuePrefix (value, defaultValue) {
  if (value == null || value === '') return defaultValue

  const normalizedValue = String(value).trim()
  return normalizedValue || defaultValue
}

function normalizeEvents (events) {
  if (!events || typeof events !== 'object') return undefined
  return events
}

function getWorkerEventHandlerName (eventName) {
  return `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`
}
