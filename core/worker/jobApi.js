import {
  AVAILABLE_WORKERS,
  getJobsMap,
  getQueue,
  getQueueEvents,
  getRuntimeOptions
} from './runtime.js'
import {
  buildEnqueueConfig,
  createJobNotFoundError,
  normalizeLimit,
  normalizeStates,
  validateJobName
} from './jobOptions.js'
import { createJobRef, normalizeJobRef } from './jobRef.js'
import { createJobFailedError, serializeJobStatus } from './jobStatus.js'
import { getTrackedJobRefs, trackJob, untrackJobRef } from './tracking.js'

export async function enqueueJob (name, data = {}, options = {}) {
  return await enqueueJobInternal(name, data, options, 'enqueueJob')
}

export async function enqueueJobInternal (name, data = {}, options = {}, caller = 'enqueueJob') {
  validateJobName(name, caller)

  const jobs = await getJobsMap()
  const jobDefinition = jobs.get(name)

  if (!jobDefinition) throw createJobNotFoundError(name, jobs, caller)

  const {
    worker,
    payload,
    jobOptions,
    trackingKey
  } = await buildEnqueueConfig({
    name,
    data,
    options,
    jobDefinition,
    defaultTimeout: getRuntimeOptions().jobTimeout,
    caller
  })

  const queue = getQueue(worker)
  const job = await queue.add(name, payload, jobOptions)
  const ref = {
    ...createJobRef(job, worker),
    name
  }

  if (trackingKey) {
    try {
      await trackJob({ ref, name, trackingKey })
    } catch (error) {
      throw await createJobTrackingError({ error, ref, job, jobOptions })
    }
  }

  return ref
}

export async function waitJob (jobRef, options = {}) {
  const { ref, queue, job } = await getJobByRef(jobRef, 'waitJob')

  if (!job) {
    throw new Error(`[@startupjs/worker] waitJob: job "${ref.worker}:${ref.id}" not found`)
  }

  const state = await job.getState()
  if (state === 'completed') {
    if (job.returnvalue != null) return job.returnvalue
    return await getCompletedReturnValue(queue, ref.id)
  }
  if (state === 'failed') throw await createJobFailedError(job, ref)

  try {
    const result = await job.waitUntilFinished(getQueueEvents(ref.worker), options.timeout)
    const completedJob = await queue.getJob(ref.id)

    if (result == null) {
      return await getCompletedReturnValue(queue, ref.id)
    }

    if (completedJob && await completedJob.getState() === 'completed') {
      return completedJob.returnvalue
    }

    return result
  } catch (error) {
    const currentState = await job.getState()
    if (currentState === 'failed') throw await createJobFailedError(job, ref, error)
    throw error
  }
}

async function getCompletedReturnValue (queue, jobId) {
  let returnvalue

  for (let attempt = 0; attempt < 100; attempt++) {
    const job = await queue.getJob(jobId)

    if (!job) return
    const state = await job.getState()
    returnvalue = job.returnvalue

    if (returnvalue != null) return returnvalue
    if (state === 'completed') {
      await new Promise(resolve => setTimeout(resolve, 10))
      continue
    }

    await new Promise(resolve => setTimeout(resolve, 10))
  }

  const job = await queue.getJob(jobId)
  return job?.returnvalue ?? returnvalue
}

export async function getJobStatus (jobRef) {
  const { ref, job } = await getJobByRef(jobRef, 'getJobStatus')
  return await serializeJobStatus(job, ref)
}

export async function getJobLogs (jobRef, options = {}) {
  const {
    start = 0,
    end = -1,
    asc = true
  } = options
  const ref = normalizeJobRef(jobRef, 'getJobLogs')
  const queue = getQueue(ref.worker)
  return await queue.getJobLogs(ref.id, start, end, asc)
}

export async function queryJobs (query = {}) {
  const {
    trackingKey,
    name,
    worker,
    asc = true
  } = query
  const limit = normalizeLimit(query.limit)
  const states = normalizeStates(query.states)

  if (trackingKey) {
    return await queryTrackedJobs({ trackingKey, name, worker, states, limit })
  }

  const workers = worker ? [worker] : AVAILABLE_WORKERS
  const result = []

  for (const workerName of workers) {
    const queue = getQueue(workerName)
    const jobs = await queue.getJobs(states, 0, Math.max(limit - result.length - 1, 0), asc)

    for (const job of jobs) {
      if (name && job.name !== name) continue
      result.push(await serializeJobStatus(job, {
        ...createJobRef(job, workerName),
        name: job.name
      }))
      if (result.length >= limit) return result
    }
  }

  return result
}

export async function getJobsCount (query = {}) {
  const {
    trackingKey,
    name,
    worker
  } = query
  const states = normalizeStates(query.states)

  if (name && !trackingKey) {
    throw new Error(
      '[@startupjs/worker] getJobsCount: "name" filter requires "trackingKey". ' +
        'BullMQ can count jobs by queue state, but exact job-name counts require worker tracking.'
    )
  }

  if (trackingKey) {
    return await countTrackedJobs({ trackingKey, name, worker, states })
  }

  const workers = worker ? [worker] : AVAILABLE_WORKERS
  let count = 0

  for (const workerName of workers) {
    const counts = await getQueue(workerName).getJobCounts(...states)
    count += Object.values(counts).reduce((sum, value) => sum + Number(value || 0), 0)
  }

  return count
}

export async function cancelJob (jobRef, options = {}) {
  const { ref, job } = await getJobByRef(jobRef, 'cancelJob')

  if (!job) {
    await untrackJobRef(ref)
    return { ref, cancelled: false, state: 'unknown' }
  }

  const state = await job.getState()
  if (state === 'active' && !options.force) {
    throw new Error('[@startupjs/worker] cancelJob: active jobs can not be cancelled')
  }

  await job.remove()
  await untrackJobRef(ref)

  return { ref, cancelled: true, state }
}

async function createJobTrackingError ({ error, ref, job, jobOptions }) {
  let rolledBack = false
  let rollbackError

  if (canRollbackTrackingFailure(jobOptions)) {
    try {
      await job.remove()
      rolledBack = true
    } catch (error) {
      rollbackError = error
    }
  }

  const trackingError = new Error(
    '[@startupjs/worker] enqueueJob: job was enqueued but tracking failed.' +
      (rolledBack
        ? ' The enqueued job was removed.'
        : ' Use error.jobRef to inspect or cancel the job manually.')
  )

  trackingError.cause = error
  trackingError.jobRef = ref
  trackingError.rolledBack = rolledBack
  if (rollbackError) trackingError.rollbackError = rollbackError

  return trackingError
}

function canRollbackTrackingFailure (jobOptions) {
  return !jobOptions.deduplication && jobOptions.jobId == null
}

async function queryTrackedJobs ({ trackingKey, name, worker, states, limit }) {
  const refs = await getTrackedJobRefs(trackingKey)
  const stateSet = new Set(states)
  const result = []

  for (const ref of refs) {
    if (worker && ref.worker !== worker) continue

    const queue = getQueue(ref.worker)
    const job = await queue.getJob(ref.id)

    if (!job) {
      await untrackJobRef(ref, trackingKey)
      continue
    }

    if (name && job.name !== name) continue

    const state = await job.getState()
    if (!stateSet.has(state)) continue

    result.push(await serializeJobStatus(job, {
      ...ref,
      name: job.name
    }))

    if (result.length >= limit) return result
  }

  return result
}

async function countTrackedJobs ({ trackingKey, name, worker, states }) {
  const refs = await getTrackedJobRefs(trackingKey)
  const stateSet = new Set(states)
  let count = 0

  for (const ref of refs) {
    if (worker && ref.worker !== worker) continue

    const queue = getQueue(ref.worker)
    const job = await queue.getJob(ref.id)

    if (!job) {
      await untrackJobRef(ref, trackingKey)
      continue
    }

    if (name && job.name !== name) continue

    const state = await job.getState()
    if (!stateSet.has(state)) continue

    count++
  }

  return count
}

async function getJobByRef (jobRef, caller) {
  const ref = normalizeJobRef(jobRef, caller)
  const queue = getQueue(ref.worker)
  const job = await queue.getJob(ref.id)

  return { ref, queue, job }
}
