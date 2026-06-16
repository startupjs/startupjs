import { enqueueJobInternal, waitJob } from './jobApi.js'

export default async function runJob (name, data = {}, options = {}) {
  const jobRef = await enqueueJobInternal(name, data, options, 'runJob')
  return await waitJob(jobRef)
}
