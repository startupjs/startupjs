import { Worker } from 'bullmq'
import { fileURLToPath } from 'url'
import {
  AVAILABLE_WORKERS,
  closeRuntimeResources,
  emitWorkerEvent,
  getJobsMap,
  getQueue,
  getQueueJobOptions,
  getRuntimeOptions,
  setRuntimeOptionsOverrides,
  getWorkerConnection,
  getWorkersToStart
} from './runtime.js'
import { createJobRef } from './jobRef.js'
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

export async function closeWorkers (options = {}) {
  await gracefulShutdown(0, {
    exitProcess: false,
    force: Boolean(options.force)
  })
}

function startWorker (workerName, runtimeOptions) {
  if (activeWorkers.has(workerName)) return activeWorkers.get(workerName)

  const worker = new Worker(
    workerName,
    runtimeOptions.useSeparateProcess ? PROCESS_JOB_PATH : processJob,
    {
      prefix: runtimeOptions.queuePrefix,
      connection: getWorkerConnection(),
      concurrency: runtimeOptions.concurrency,
      useWorkerThreads: runtimeOptions.useSeparateProcess && runtimeOptions.useWorkerThreads,
      ...getQueueJobOptions()
    }
  )

  worker.on('error', error => {
    console.error(`[@startupjs/worker] Worker "${workerName}" error:`, error)
  })
  attachWorkerLifecycleEvents(worker, workerName)

  activeWorkers.set(workerName, worker)
  return worker
}

function attachWorkerLifecycleEvents (worker, workerName) {
  worker.on('active', job => {
    emitWorkerLifecycleEvent('started', createWorkerEvent(job, workerName, {
      state: 'active'
    }))
  })

  worker.on('progress', (job, progress) => {
    emitWorkerLifecycleEvent('progress', createWorkerEvent(job, workerName, {
      state: 'active',
      progress
    }))
  })

  worker.on('completed', (job, result) => {
    emitWorkerLifecycleEvent('completed', createWorkerEvent(job, workerName, {
      state: 'completed',
      result
    }))
  })

  worker.on('failed', (job, error) => {
    emitWorkerLifecycleEvent('failed', createWorkerEvent(job, workerName, {
      state: 'failed',
      error
    }))
  })
}

function emitWorkerLifecycleEvent (eventName, event) {
  emitWorkerEvent(eventName, event).catch(error => {
    console.error(`[@startupjs/worker] Failed to emit "${eventName}" lifecycle event:`, error)
  })
}

function createWorkerEvent (job, workerName, event = {}) {
  if (!job) {
    return {
      ref: null,
      name: null,
      worker: workerName,
      data: undefined,
      meta: undefined,
      job: undefined,
      ...event
    }
  }

  const payload = job.data || {}
  const name = payload.type || job.name
  const worker = payload.meta?.worker || workerName

  return {
    ref: {
      ...createJobRef(job, worker),
      name
    },
    name,
    worker,
    data: payload.data,
    meta: payload.meta,
    job,
    ...event
  }
}

async function syncSchedulers (workerName, jobs, runtimeOptions) {
  const queue = getQueue(workerName)
  const relevantSchedulerIds = []

  for (const [jobName, jobDefinition] of jobs.entries()) {
    if (jobDefinition.worker !== workerName) continue
    if (!jobDefinition.cron) continue

    const { pattern, data } = jobDefinition.cron
    relevantSchedulerIds.push(jobName)

    await queue.upsertJobScheduler(
      jobName,
      { pattern, key: jobName },
      {
        data: {
          type: jobName,
          timeout: runtimeOptions.jobTimeout,
          data
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

async function gracefulShutdown (exitCode = 0, { exitProcess = true, force = false } = {}) {
  if (shutdownPromise) return shutdownPromise

  shutdownPromise = (async () => {
    const workers = Array.from(activeWorkers.values())

    if (exitProcess) console.log('Waiting for worker(s) to close and exiting...')

    let forceExitTimeout
    if (exitProcess) {
      forceExitTimeout = setTimeout(() => {
        console.error('WARNING! Worker did not close in 60 seconds during shutdown. Forcing exit...')
        process.exit(exitCode)
      }, 60000)
    }

    try {
      await Promise.allSettled(workers.map(worker => worker.close(force)))
      activeWorkers.clear()
      await closeRuntimeResources()
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
