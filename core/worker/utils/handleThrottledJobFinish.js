import omit from 'lodash/omit.js'
import sortBy from 'lodash/sortBy.js'
import addThrottledJob from './addThrottledJob.js'

export default async function handleThrottledJobFinish (queue, job) {
  const uniqId = job.data.uniqId

  // jobs without uniqId can not be throttled
  if (!uniqId) return

  const jobs = await queue.getJobs(['delayed'])
  if (!jobs.length) return

  const sortedJobs = sortBy(jobs.filter(job => job.data.uniqId === uniqId), 'timestamp')
  if (!sortedJobs.length) return

  const lastAddedJob = sortedJobs[sortedJobs.length - 1]
  const { data, opts } = lastAddedJob

  await Promise.all(sortedJobs.map(job => job.remove()))
  await addThrottledJob(data.type, data, omit(opts, 'delay'))
}
