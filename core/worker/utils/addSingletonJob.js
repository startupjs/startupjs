import { queue, queueEvents } from '../queue.js'

export default async function addSingletonJob (type, params = {}, options = {}) {
  let { uniqId, ...jobData } = params
  const { waitForResult = true, ...jobOptions } = options

  if (!uniqId) uniqId = type

  const jobs = await queue.getJobs(['active'])

  // if there is already an active job with the same uniqId, bullmq will return it
  const job = await queue.add(
    type,
    { type, uniqId, ...jobData },
    { deduplication: { id: uniqId }, ...jobOptions }
  )

  const status = jobs.find(job => job.data.uniqId === uniqId)?.id === job.id
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
