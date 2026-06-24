export async function serializeJobStatus (job, ref) {
  if (!job) {
    return {
      ref,
      state: 'unknown'
    }
  }

  const state = await job.getState()
  const payload = job.data || {}

  return {
    ref,
    state,
    progress: job.progress,
    result: job.returnvalue,
    error: job.failedReason,
    failedReason: job.failedReason,
    stacktrace: job.stacktrace,
    createdAt: job.timestamp,
    processedAt: job.processedOn,
    finishedAt: job.finishedOn,
    attemptsMade: job.attemptsMade,
    attemptsStarted: job.attemptsStarted,
    data: payload.data,
    meta: payload.meta
  }
}

export async function createJobFailedError (job, ref, cause) {
  const status = await serializeJobStatus(job, ref)
  const error = new Error(job.failedReason || cause?.message || '[@startupjs/worker] Job failed')
  error.job = status
  if (cause) error.cause = cause
  return error
}
