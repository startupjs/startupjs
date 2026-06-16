const JOB_REF_SEPARATOR = ':'

export function createJobRef (job, worker) {
  const id = job?.id
  if (!id) {
    throw new Error('[@startupjs/worker] createJobRef: job.id is required')
  }
  validateWorker(worker, 'createJobRef')

  return {
    id: String(id),
    worker
  }
}

export function normalizeJobRef (jobRef, caller = 'normalizeJobRef') {
  if (typeof jobRef === 'string') return parseJobRef(jobRef, caller)

  if (!jobRef || typeof jobRef !== 'object') {
    throw new Error(`[@startupjs/worker] ${caller}: jobRef must be an object or string`)
  }

  const { id, worker } = jobRef

  if (id == null || id === '') {
    throw new Error(`[@startupjs/worker] ${caller}: jobRef.id is required`)
  }
  validateWorker(worker, caller)

  return {
    id: String(id),
    worker,
    ...(jobRef.name ? { name: jobRef.name } : {})
  }
}

export function serializeJobRef (jobRef) {
  const ref = normalizeJobRef(jobRef, 'serializeJobRef')
  return `${ref.worker}${JOB_REF_SEPARATOR}${ref.id}`
}

export function parseJobRef (value, caller = 'parseJobRef') {
  if (typeof value !== 'string' || !value.includes(JOB_REF_SEPARATOR)) {
    throw new Error(
      `[@startupjs/worker] ${caller}: serialized jobRef must look like "worker:id"`
    )
  }

  const separatorIndex = value.indexOf(JOB_REF_SEPARATOR)
  const worker = value.slice(0, separatorIndex)
  const id = value.slice(separatorIndex + 1)

  if (!id) {
    throw new Error(`[@startupjs/worker] ${caller}: serialized jobRef id is required`)
  }
  validateWorker(worker, caller)

  return { worker, id }
}

function validateWorker (worker, caller) {
  if (typeof worker !== 'string' || !worker.trim()) {
    throw new Error(`[@startupjs/worker] ${caller}: jobRef.worker is required`)
  }
}
