import { createBackend } from 'startupjs/server'
import { readdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { ROOT_MODULE as MODULE } from '@startupjs/registry'
import createWorker from './utils/createWorker.js'
import getParam from './utils/getParam.js'
import handleThrottledJobFinish from './utils/handleThrottledJobFinish.js'
import isJobsFolderExists from './utils/isJobsFolderExists.js'
import maybeRemoveJobSchedulers from './utils/maybeRemoveJobSchedulers.js'
import processJobFn from './utils/processJob.js'
import { setAction } from './actions.js'
import { queue } from './queue.js'

const __filename = fileURLToPath(import.meta.url)

let worker = null

export default async function startWorker () {
  const queueName = getParam('QUEUE_NAME')
  const concurrency = Number(getParam('CONCURRENCY'))
  const useSeparateProcess = getParam('USE_SEPARATE_PROCESS')
  // this only works if useSeparateProcess is true
  const useWorkerThreads = getParam('USE_WORKER_THREADS')
  const autoStart = getParam('AUTO_START')

  // Initialize backend only if the worker runs in a separate process
  // In the main process the backend is already initialized by startupjs
  if (useSeparateProcess === true || useSeparateProcess === 'true') {
    createBackend()
  }

  if (autoStart === 'false' || autoStart === false) {
    console.log('[@startupjs/worker] startWorker: autoStart disabled, worker not starting')
    return
  }

  const hasJobsFolder = isJobsFolderExists()
  if (!hasJobsFolder) {
    console.log('[@startupjs/worker] startWorker: workerJobs folder not found')
    await maybeRemoveJobSchedulers(queue, [])
  }
  const options = {}
  let processJob
  if (concurrency != null) options.concurrency = concurrency
  if (useSeparateProcess) {
    processJob = join(dirname(__filename), 'utils', 'processJob.js')
    if (useWorkerThreads) options.useWorkerThreads = true
  } else {
    processJob = processJobFn
  }

  worker = createWorker({
    name: queueName,
    processJob,
    options
  })

  worker.on('error', (err) => {
    console.error('[@startupjs/worker] bullmq worker error: ', err)
  })

  // Use worker events (instead of QueueEvents that receive events from all workers)
  // to handle throttled jobs in worker event listeners because they are local -
  // meaning they are received only by the worker instance that processed the job.
  worker.on('completed', (job) => {
    handleThrottledJobFinish(queue, job)
  })

  worker.on('failed', (job) => {
    handleThrottledJobFinish(queue, job)
  })

  const schedulerIds = []
  const allJobs = {}

  // 1. First, load jobs from workerJobs/ files (if the folder exists)
  if (hasJobsFolder) {
    for (const fileName of readdirSync(join(process.cwd(), 'workerJobs'))) {
      const { default: action, cron } = await import(join(process.cwd(), 'workerJobs', fileName))

      if (!action) continue
      const type = fileName.split('.')[0]

      setAction(type, action)

      const { pattern, jobData = {} } = cron || {}
      if (!pattern) continue

      allJobs[type] = {
        action,
        pattern,
        jobData,
        source: 'file'
      }
    }
  }

  // 2. Collect jobs from plugins
  try {
    const existingJobsForHook = {}
    for (const jobName in allJobs) {
      const job = allJobs[jobName]
      if (job.source === 'file') {
        const cronObj = Object.keys(job.jobData || {}).length > 0
          ? { pattern: job.pattern, jobData: job.jobData }
          : job.pattern
        existingJobsForHook[jobName] = {
          default: job.action,
          cron: cronObj
        }
      }
    }

    const pluginJobs = MODULE.reduceHook('workerJobs', existingJobsForHook)

    for (const jobName in pluginJobs) {
      const job = pluginJobs[jobName]
      if (!job) continue

      let jobModule
      if (job.then) {
        jobModule = await job
      } else {
        jobModule = job
      }

      if (!jobModule.default) {
        console.log(`[@startupjs/worker] No default export for job '${jobName}'`)
        continue
      }

      setAction(jobName, jobModule.default)

      let pattern, jobData = {}
      if (typeof jobModule.cron === 'string') {
        pattern = jobModule.cron
      } else if (jobModule.cron && jobModule.cron.pattern) {
        pattern = jobModule.cron.pattern
        jobData = jobModule.cron.jobData || {}
      } else {
        console.log(`[@startupjs/worker] No cron pattern for job '${jobName}'`)
        continue
      }

      allJobs[jobName] = {
        action: jobModule.default,
        pattern,
        jobData,
        source: 'plugin'
      }
    }

  } catch (error) {
    console.error('[@startupjs/worker] Error collecting jobs from plugins:', error)
  }

  // 3. Register all jobs in the queue
  for (const jobName in allJobs) {
    const { pattern, jobData } = allJobs[jobName]

    schedulerIds.push(jobName)
    await queue.upsertJobScheduler(
      jobName,
      { pattern, key: jobName },
      { data: { type: jobName, ...jobData } }
    )
  }

  await maybeRemoveJobSchedulers(queue, schedulerIds)
}

// Handle graceful shutdown of the worker
let shuttingDown = false
async function gracefulShutdown (exitCode = 0) {
  if (shuttingDown) return
  shuttingDown = true
  const promises = []
  if (worker) promises.push(worker.close())

  // in development we exit as soon as the http server is closed
  console.log('Waiting for worker to close and exiting...')
  waitAndExit()

  async function waitAndExit () {
    setTimeout(() => {
      console.error('WARNING! Worker did not close in 60 seconds during the shutdown process. Forcing exit...')
      process.exit(exitCode)
    }, 60000) // fallback to force exit after 60 seconds
    await Promise.all(promises)
    process.exit(exitCode)
  }
}

process.on('SIGTERM', () => gracefulShutdown())
process.on('SIGINT', () => gracefulShutdown())
process.on('SIGQUIT', () => gracefulShutdown())

process.on('uncaughtException', (err) => {
  console.log('uncaught:', err, err.stack)
  gracefulShutdown(1)
})
