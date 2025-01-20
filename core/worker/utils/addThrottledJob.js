import { queue, queueEvents } from '../queue.js'

const DELAY = 24 * 60 * 60 * 1000 // 24 hours

export default async function addThrottledJob (type, params = {}, options = {}) {
  let { uniqId, ...jobData } = params
  const { trailing = true, waitForResult, ...jobOptions } = options

  if (!uniqId) uniqId = type

  const activeJobs = await queue.getJobs(['active'])
  const waitingJobs = await queue.getJobs(['waiting'])
  let job

  // Find 'active' or 'waiting' jobs with the same uniqId and add a delayed one
  // without 'deduplication' options otherwise bullmq won't add it.
  // Later on (on original job completion or fail) these delayed jobs will be removed
  // and only the last one added
  if (trailing) {
    if (activeJobs.concat(waitingJobs).filter(job => job.data.uniqId === uniqId).length) {
      job = await queue.add(
        type,
        { type, uniqId, ...jobData },
        { delay: DELAY, ...jobOptions }
      )
    }
  }

  if (!job) {
    job = await queue.add(
      type,
      { type, uniqId, ...jobData },
      { deduplication: { id: uniqId }, ...jobOptions }
    )
  }

  const status = activeJobs.find(job => job.data.uniqId === uniqId)?.id === job.id
    ? 'existing'
    : 'new'

  if (!waitForResult) return { job, status }

  let data
  let error
  try {
    data = await job.waitUntilFinished(queueEvents)
  } catch (err) {
    error = err
  }

  return { job, data, error, status }
}
