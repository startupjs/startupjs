const DAY_IN_MS = 24 * 60 * 60 * 1000
export const AUTO_REMOVE_JOB_OPTIONS = {
  removeOnComplete: { age: DAY_IN_MS },
  removeOnFail: { age: DAY_IN_MS }
}
export const CONCURRENCY = 300
export const JOB_TIMEOUT = 30000
export const USE_WORKER_THREADS = true
export const AUTO_START = true
