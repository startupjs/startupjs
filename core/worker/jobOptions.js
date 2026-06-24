const DEFAULT_ACTIVE_STATES = Object.freeze([
  'waiting',
  'delayed',
  'prioritized',
  'active',
  'waiting-children'
])

const DEFAULT_DUPLICATE_POLICY = 'return-existing'
const DUPLICATE_POLICIES = Object.freeze([
  DEFAULT_DUPLICATE_POLICY,
  'skip',
  'throw'
])
const DEBOUNCE_DUPLICATE_POLICIES = Object.freeze([
  ...DUPLICATE_POLICIES,
  'replace'
])

export function validateJobName (name, caller) {
  if (typeof name !== 'string' || !name.trim()) {
    throw new Error(`[@startupjs/worker] ${caller}: "name" must be a non-empty string`)
  }
}

export function createJobNotFoundError (name, jobs, caller) {
  const availableJobs = Array.from(jobs.keys())
  return new Error(
    `[@startupjs/worker] ${caller}: job "${name}" not found.` +
      (availableJobs.length
        ? ` Available jobs: ${availableJobs.join(', ')}`
        : ' No jobs are currently registered.')
  )
}

export async function buildEnqueueConfig ({
  name,
  data,
  options = {},
  jobDefinition,
  defaultTimeout,
  caller
}) {
  validateJobName(name, caller)

  const worker = resolveWorker({ jobDefinition, options, caller })
  const timeout = options.timeout ?? defaultTimeout
  const trackingKey = normalizeTrackingKey(options.trackingKey)

  const payload = {
    type: name,
    timeout,
    data,
    meta: {
      enqueuedAt: Date.now(),
      worker,
      ...(trackingKey ? { trackingKey } : {})
    }
  }

  const jobOptions = {
    ...(options.jobOptions || {})
  }

  applyDelayOptions(jobOptions, options, caller)
  applyKnownJobOptions(jobOptions, options)

  const deduplicationConfig = await resolveDeduplication({
    name,
    data,
    worker,
    options,
    jobDefinition,
    caller
  })

  if (deduplicationConfig) {
    if (deduplicationConfig.delay != null) {
      jobOptions.delay = deduplicationConfig.delay
    }

    if (deduplicationConfig.options) {
      jobOptions.deduplication = {
        ...(jobOptions.deduplication || {}),
        ...deduplicationConfig.options
      }
    }
  }

  return {
    worker,
    payload,
    jobOptions,
    trackingKey,
    deduplication: deduplicationConfig?.meta
  }
}

export function normalizeStates (states) {
  if (states == null) return DEFAULT_ACTIVE_STATES.slice()
  const list = Array.isArray(states) ? states : [states]
  return list
    .map(state => String(state).trim())
    .filter(Boolean)
}

export function normalizeLimit (limit, defaultValue = 100) {
  if (limit == null) return defaultValue

  const normalizedLimit = Number(limit)
  if (!Number.isFinite(normalizedLimit) || normalizedLimit < 1) return defaultValue

  return Math.floor(normalizedLimit)
}

export function normalizeTrackingKey (trackingKey) {
  if (trackingKey == null || trackingKey === '') return undefined
  if (typeof trackingKey === 'string') return trackingKey
  return stableStringify(trackingKey)
}

function resolveWorker ({ jobDefinition, options, caller }) {
  const worker = options.worker ?? jobDefinition.worker
  if (typeof worker !== 'string' || !worker.trim()) {
    throw new Error(`[@startupjs/worker] ${caller}: worker must be a non-empty string`)
  }
  return worker
}

function applyDelayOptions (jobOptions, options, caller) {
  const hasDelay = options.delay != null
  const hasStartAt = options.startAt != null

  if (hasDelay && hasStartAt) {
    throw new Error(`[@startupjs/worker] ${caller}: use either "delay" or "startAt", not both`)
  }

  if (options.debounce && (hasDelay || hasStartAt)) {
    throw new Error(
      `[@startupjs/worker] ${caller}: debounce controls job delay; do not pass "delay" or "startAt" with debounce`
    )
  }

  if (hasDelay) {
    jobOptions.delay = normalizeDelay(options.delay, caller)
    return
  }

  if (hasStartAt) {
    const startAt = options.startAt instanceof Date
      ? options.startAt.getTime()
      : Number(options.startAt)

    if (!Number.isFinite(startAt)) {
      throw new Error(`[@startupjs/worker] ${caller}: "startAt" must be a Date or timestamp`)
    }

    jobOptions.delay = Math.max(0, startAt - Date.now())
  }
}

function applyKnownJobOptions (jobOptions, options) {
  for (const key of [
    'priority',
    'attempts',
    'backoff',
    'removeOnComplete',
    'removeOnFail'
  ]) {
    if (options[key] !== undefined) jobOptions[key] = options[key]
  }
}

function normalizeDelay (delay, caller) {
  const normalizedDelay = Number(delay)
  if (!Number.isFinite(normalizedDelay) || normalizedDelay < 0) {
    throw new Error(`[@startupjs/worker] ${caller}: "delay" must be a non-negative number`)
  }
  return normalizedDelay
}

async function resolveDeduplication ({
  name,
  data,
  worker,
  options,
  jobDefinition,
  caller
}) {
  if (options.debounce) {
    return resolveDebounceDeduplication({ name, worker, debounce: options.debounce, caller })
  }

  if (options.throttle) {
    return resolveThrottleDeduplication({ name, worker, throttle: options.throttle, caller })
  }

  const singleton = options.singleton ?? jobDefinition.singleton
  const singletonId = await getSingletonDeduplicationId({ singleton, name, worker }, data, caller)
  if (!singletonId) return
  const policy = getSingletonDuplicatePolicy(singleton, caller)

  return {
    options: { id: singletonId },
    meta: {
      id: singletonId,
      reason: 'singleton',
      policy
    }
  }
}

export async function getSingletonDeduplicationId (jobDefinition, data, caller = 'enqueueJob') {
  const { singleton, name, worker } = jobDefinition
  if (!singleton) return

  if (singleton === true) {
    return `singleton:${worker}:${name}`
  }

  let singletonPayload

  if (typeof singleton === 'function') {
    singletonPayload = await Promise.resolve(singleton(data))
  } else if (typeof singleton === 'object') {
    singletonPayload = singleton.key
  } else {
    throw new Error(
      `[@startupjs/worker] ${caller}: singleton must be true, false, a function or { key }`
    )
  }

  const hash = stableStringify(singletonPayload)

  if (typeof hash !== 'string') {
    throw new Error(
      `[@startupjs/worker] ${caller}: singleton function for "${name}" must return a JSON-serializable value`
    )
  }

  return `singleton:${worker}:${name}:${hash}`
}

function getSingletonDuplicatePolicy (singleton, caller) {
  if (singleton && typeof singleton === 'object') {
    return normalizeDuplicatePolicy(singleton.onDuplicate, caller)
  }
  return DEFAULT_DUPLICATE_POLICY
}

function resolveDebounceDeduplication ({ name, worker, debounce, caller }) {
  if (!debounce || typeof debounce !== 'object') {
    throw new Error(`[@startupjs/worker] ${caller}: debounce must be an object`)
  }

  const key = normalizeRequiredKey(debounce.key, 'debounce.key', caller)
  const delay = normalizeDelay(debounce.delay ?? debounce.ttl, caller)
  const policy = normalizeDuplicatePolicy(
    debounce.onDuplicate ?? (debounce.replace === false ? DEFAULT_DUPLICATE_POLICY : 'replace'),
    caller,
    DEBOUNCE_DUPLICATE_POLICIES
  )
  const replace = policy === 'replace'

  return {
    delay,
    options: {
      id: `debounce:${worker}:${name}:${key}`,
      ttl: delay,
      extend: debounce.extend ?? true,
      replace
    },
    meta: {
      id: `debounce:${worker}:${name}:${key}`,
      reason: 'debounce',
      policy
    }
  }
}

function resolveThrottleDeduplication ({ name, worker, throttle, caller }) {
  if (!throttle || typeof throttle !== 'object') {
    throw new Error(`[@startupjs/worker] ${caller}: throttle must be an object`)
  }

  const key = normalizeRequiredKey(throttle.key, 'throttle.key', caller)
  const ttl = normalizePositiveDelay(throttle.ttl, 'throttle.ttl', caller)
  const policy = normalizeDuplicatePolicy(throttle.onDuplicate, caller)
  const id = `throttle:${worker}:${name}:${key}`

  if (throttle.trailing) {
    return {
      meta: {
        id,
        trailingId: `throttle-trailing:${worker}:${name}:${key}`,
        reason: 'throttle',
        policy: 'trailing',
        trailing: true,
        key,
        ttl
      }
    }
  }

  return {
    options: {
      id,
      ttl
    },
    meta: {
      id,
      reason: 'throttle',
      policy
    }
  }
}

function normalizeRequiredKey (value, label, caller) {
  const key = normalizeTrackingKey(value)
  if (!key) {
    throw new Error(`[@startupjs/worker] ${caller}: ${label} is required`)
  }
  return key
}

function normalizePositiveDelay (value, label, caller) {
  const normalizedDelay = normalizeDelay(value, caller)
  if (normalizedDelay > 0) return normalizedDelay

  throw new Error(`[@startupjs/worker] ${caller}: ${label} must be a positive number`)
}

function normalizeDuplicatePolicy (
  policy = DEFAULT_DUPLICATE_POLICY,
  caller,
  allowedPolicies = DUPLICATE_POLICIES
) {
  if (policy == null) return DEFAULT_DUPLICATE_POLICY
  if (allowedPolicies.includes(policy)) return policy

  throw new Error(
    `[@startupjs/worker] ${caller}: onDuplicate must be one of: ${allowedPolicies.join(', ')}`
  )
}

function stableStringify (value) {
  if (typeof value === 'string') return value
  if (value == null) return String(value)

  return JSON.stringify(sortObject(value))
}

function sortObject (value) {
  if (!value || typeof value !== 'object') return value
  if (Array.isArray(value)) return value.map(sortObject)

  return Object.keys(value).sort().reduce((result, key) => {
    result[key] = sortObject(value[key])
    return result
  }, {})
}
