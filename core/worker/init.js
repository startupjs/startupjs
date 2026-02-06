import { Worker } from 'bullmq'
import { fileURLToPath } from 'url'
import { redisPrefix } from 'startupjs/server'
import {
  AVAILABLE_WORKERS,
  getJobsMap,
  getQueue,
  getQueueJobOptions,
  getRuntimeOptions,
  setRuntimeOptionsOverrides,
  getWorkerConnection,
  getWorkersToStart
} from './runtime.js'
import processJob from './processJob.js'

const PROCESS_JOB_PATH = fileURLToPath(new URL('./processJob.js', import.meta.url))

const activeWorkers = new Map()
let shutdownHandlersAttached = false
let shutdownPromise

export default async function init (options = {}) {
  const jobs = await getJobsMap({ refresh: true })
  const runtimeOptions = getRuntimeOptions(options)
  setRuntimeOptionsOverrides(runtimeOptions)
  const workersToStart = getWorkersToStart(options.workers)

  await Promise.all(workersToStart.map(workerName => syncSchedulers(workerName, jobs, runtimeOptions)))
  await Promise.all(workersToStart.map(workerName => startWorker(workerName, runtimeOptions)))

  attachShutdownHandlers()

  return {
    workers: workersToStart,
    queues: AVAILABLE_WORKERS.slice()
  }
}

export async function closeWorkers () {
  await gracefulShutdown(0, { exitProcess: false })
}

function startWorker (workerName, runtimeOptions) {
  if (activeWorkers.has(workerName)) return activeWorkers.get(workerName)

  const worker = new Worker(
    workerName,
    runtimeOptions.useSeparateProcess ? PROCESS_JOB_PATH : processJob,
    {
      prefix: redisPrefix,
      connection: getWorkerConnection(),
      concurrency: runtimeOptions.concurrency,
      useWorkerThreads: runtimeOptions.useSeparateProcess && runtimeOptions.useWorkerThreads,
      ...getQueueJobOptions()
    }
  )

  worker.on('error', error => {
    console.error(`[@startupjs/worker] Worker "${workerName}" error:`, error)
  })

  activeWorkers.set(workerName, worker)
  return worker
}

async function syncSchedulers (workerName, jobs, runtimeOptions) {
  const queue = getQueue(workerName)
  const relevantSchedulerIds = []

  for (const [jobName, jobDefinition] of jobs.entries()) {
    if (jobDefinition.worker !== workerName) continue
    if (!jobDefinition.cron) continue

    const { pattern, data = {} } = jobDefinition.cron
    relevantSchedulerIds.push(jobName)

    await queue.upsertJobScheduler(
      jobName,
      { pattern, key: jobName },
      {
        data: {
          ...data,
          type: jobName,
          timeout: data.timeout ?? runtimeOptions.jobTimeout
        }
      }
    )
  }

  const existingSchedulers = await queue.getJobSchedulers()

  for (const scheduler of existingSchedulers) {
    if (relevantSchedulerIds.includes(scheduler.name)) continue
    await queue.removeJobScheduler(scheduler.name)
  }
}

function attachShutdownHandlers () {
  if (shutdownHandlersAttached) return
  shutdownHandlersAttached = true

  process.on('SIGTERM', () => gracefulShutdown())
  process.on('SIGINT', () => gracefulShutdown())
  process.on('SIGQUIT', () => gracefulShutdown())

  process.on('uncaughtException', error => {
    console.error('uncaught:', error, error.stack)
    gracefulShutdown(1)
  })
}

async function gracefulShutdown (exitCode = 0, { exitProcess = true } = {}) {
  if (shutdownPromise) return shutdownPromise

  shutdownPromise = (async () => {
    const workers = Array.from(activeWorkers.values())
    if (!workers.length) return

    if (exitProcess) console.log('Waiting for worker(s) to close and exiting...')

    let forceExitTimeout
    if (exitProcess) {
      forceExitTimeout = setTimeout(() => {
        console.error('WARNING! Worker did not close in 60 seconds during shutdown. Forcing exit...')
        process.exit(exitCode)
      }, 60000)
    }

    try {
      await Promise.all(workers.map(worker => worker.close()))
      activeWorkers.clear()
    } finally {
      if (forceExitTimeout) clearTimeout(forceExitTimeout)
      if (exitProcess) {
        process.exit(exitCode)
      } else {
        shutdownPromise = undefined
      }
    }
  })()

  return shutdownPromise
}
