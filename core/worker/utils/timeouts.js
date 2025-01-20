const JOB_TIMEOUTS = {}

export function maybeClearJobTimeout (jobId) {
  if (JOB_TIMEOUTS[jobId]) {
    clearTimeout(JOB_TIMEOUTS[jobId])
    delete JOB_TIMEOUTS[jobId]
  }
}

export function setJobTimeout (jobId, timeoutId) {
  JOB_TIMEOUTS[jobId] = timeoutId
}
