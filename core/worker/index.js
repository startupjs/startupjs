import { getJobsMap, getQueue, getQueueEvents, getRuntimeOptions } from './runtime.js'

export default async function runJob (name, data = {}, options = {}) {
  if (typeof name !== 'string' || !name.trim()) {
    throw new Error('[@startupjs/worker] runJob: "name" must be a non-empty string')
  }

  const jobs = await getJobsMap()
  const jobDefinition = jobs.get(name)

  if (!jobDefinition) {
    const availableJobs = Array.from(jobs.keys())
    throw new Error(
      `[@startupjs/worker] runJob: job "${name}" not found.` +
        (availableJobs.length
          ? ` Available jobs: ${availableJobs.join(', ')}`
          : ' No jobs are currently registered.')
    )
  }

  const queue = getQueue(jobDefinition.worker)
  const queueEvents = getQueueEvents(jobDefinition.worker)

  const payload = {
    type: name,
    timeout: options.timeout ?? getRuntimeOptions().jobTimeout,
    data
  }

  const jobOptions = {
    ...(options.jobOptions || {})
  }

  const deduplicationId = await getSingletonDeduplicationId(jobDefinition, data)
  if (deduplicationId) {
    jobOptions.deduplication = {
      ...(jobOptions.deduplication || {}),
      id: deduplicationId
    }
  }

  const job = await queue.add(name, payload, jobOptions)
  return await job.waitUntilFinished(queueEvents)
}

async function getSingletonDeduplicationId (jobDefinition, data) {
  const { singleton, name, worker } = jobDefinition
  if (!singleton) return

  if (singleton === true) {
    return `singleton:${worker}:${name}`
  }

  const singletonPayload = await Promise.resolve(singleton(data))
  const hash = JSON.stringify(singletonPayload)

  if (typeof hash !== 'string') {
    throw new Error(
      `[@startupjs/worker] runJob: singleton function for "${name}" must return a JSON-serializable value`
    )
  }

  return `singleton:${worker}:${name}:${hash}`
}
