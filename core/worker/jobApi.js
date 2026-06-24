import { randomUUID } from 'node:crypto'
import {
  AVAILABLE_WORKERS,
  getJobsMap,
  getQueue,
  getQueueEvents,
  getRuntimeOptions,
  emitWorkerEvent
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
import { attachThrottleLeadingJob, resolveThrottleTrailing } from './throttle.js'

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
    trackingKey,
    deduplication
  } = await buildEnqueueConfig({
    name,
    data,
    options,
    jobDefinition,
    defaultTimeout: getRuntimeOptions().jobTimeout,
    caller
  })

  const queue = getQueue(worker)
  const returnMeta = Boolean(options.returnMeta)
  let effectiveDeduplication = deduplication
  let throttleDecision
  let throttleClient

  if (deduplication?.trailing) {
    throttleClient = await queue.client
    throttleDecision = await resolveThrottleTrailing({
      client: throttleClient,
      deduplication
    })

    if (throttleDecision.action === 'trailing') {
      const delay = Math.max(0, throttleDecision.delay)

      jobOptions.delay = delay
      jobOptions.deduplication = {
        ...(jobOptions.deduplication || {}),
        id: deduplication.trailingId,
        ttl: Math.max(delay, 1),
        extend: true,
        replace: true
      }
      effectiveDeduplication = {
        ...deduplication,
        id: deduplication.trailingId,
        deduped: true,
        createsJobOnDuplicate: true
      }
    } else {
      effectiveDeduplication = undefined
    }
  }

  const needsDuplicateDetection = Boolean(
    effectiveDeduplication?.id &&
    (
      returnMeta ||
      effectiveDeduplication.deduped ||
      effectiveDeduplication.policy === 'skip' ||
      effectiveDeduplication.policy === 'throw'
    )
  )
  const previousDeduplicatedJobId = needsDuplicateDetection
    ? await getDeduplicationJobId(queue, effectiveDeduplication.id)
    : undefined
  let candidateJobId

  if (needsDuplicateDetection && jobOptions.jobId == null) {
    candidateJobId = createCandidateJobId()
    jobOptions.jobId = candidateJobId
  } else if (jobOptions.jobId != null) {
    candidateJobId = String(jobOptions.jobId)
  }

  const job = await queue.add(name, payload, jobOptions)
  const ref = {
    ...createJobRef(job, worker),
    name
  }
  const enqueueResult = createEnqueueResult({
    ref,
    deduplication: effectiveDeduplication,
    candidateJobId,
    previousDeduplicatedJobId
  })

  if (throttleDecision?.action === 'leading') {
    await attachThrottleLeadingJob({
      client: throttleClient,
      lockKey: throttleDecision.lockKey,
      ref
    })
  }

  if (enqueueResult.deduped && enqueueResult.policy === 'throw') {
    await emitWorkerEvent('deduped', createEnqueueEvent({
      enqueueResult,
      name,
      worker,
      payload,
      job
    }))
    throw createDuplicateJobError(enqueueResult)
  }

  if (trackingKey && shouldTrackEnqueueResult(enqueueResult)) {
    try {
      await trackJob({ ref, name, trackingKey })
    } catch (error) {
      throw await createJobTrackingError({ error, ref, job, jobOptions })
    }
  }

  if (enqueueResult.deduped) {
    await emitWorkerEvent('deduped', createEnqueueEvent({
      enqueueResult,
      name,
      worker,
      payload,
      job
    }))
  }

  if (enqueueResult.created && !enqueueResult.skipped) {
    await emitWorkerEvent('queued', createEnqueueEvent({
      enqueueResult,
      name,
      worker,
      payload,
      job
    }))
  }

  if (returnMeta) return enqueueResult
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

async function getDeduplicationJobId (queue, deduplicationId) {
  const client = await queue.client
  return await client.get(`${queue.keys.de}:${deduplicationId}`)
}

function createCandidateJobId () {
  return `meta-${randomUUID()}`
}

function createEnqueueResult ({
  ref,
  deduplication,
  candidateJobId,
  previousDeduplicatedJobId
}) {
  const matchedCandidate = candidateJobId && ref.id === candidateJobId
  const returnedExistingJob = Boolean(candidateJobId && !matchedCandidate)
  const replaced = Boolean(
    deduplication &&
    matchedCandidate &&
    previousDeduplicatedJobId &&
    (
      deduplication.policy === 'replace' ||
      deduplication.policy === 'trailing'
    )
  )
  const hasDetectedDuplicate = Boolean(
    deduplication &&
    (
      deduplication.deduped ||
      replaced ||
      returnedExistingJob
    )
  )
  const created = !hasDetectedDuplicate || replaced || Boolean(
    deduplication?.createsJobOnDuplicate && matchedCandidate
  )
  const skipped = hasDetectedDuplicate && deduplication.policy === 'skip'
  const duplicateOfId = previousDeduplicatedJobId || (returnedExistingJob ? ref.id : undefined)
  const duplicateOf = duplicateOfId
    ? {
        ...ref,
        id: duplicateOfId
      }
    : null

  return {
    ref,
    created,
    deduped: hasDetectedDuplicate,
    skipped,
    replaced,
    reason: hasDetectedDuplicate ? deduplication.reason : null,
    policy: deduplication?.policy || 'created',
    duplicateOf
  }
}

function shouldTrackEnqueueResult (enqueueResult) {
  return !enqueueResult.skipped
}

function createDuplicateJobError (enqueueResult) {
  const error = new Error(
    `[@startupjs/worker] enqueueJob: duplicate ${enqueueResult.reason || 'job'} job`
  )
  error.name = 'DuplicateJobError'
  error.jobRef = enqueueResult.ref
  error.reason = enqueueResult.reason
  error.policy = enqueueResult.policy
  error.duplicateOf = enqueueResult.duplicateOf
  return error
}

function createEnqueueEvent ({
  enqueueResult,
  name,
  worker,
  payload,
  job
}) {
  return {
    ref: enqueueResult.ref,
    name,
    worker,
    data: payload.data,
    meta: payload.meta,
    state: enqueueResult.created ? 'queued' : 'deduped',
    reason: enqueueResult.reason,
    policy: enqueueResult.policy,
    created: enqueueResult.created,
    deduped: enqueueResult.deduped,
    skipped: enqueueResult.skipped,
    replaced: enqueueResult.replaced,
    duplicateOf: enqueueResult.duplicateOf,
    job
  }
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
