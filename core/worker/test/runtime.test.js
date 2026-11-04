import test from 'node:test'
import assert from 'node:assert/strict'
import { getQueueJobOptions } from '../runtime.js'

// BullMQ's KeepJobs `age` is in seconds: one day is 86400, not 86400000.
test('finished jobs are kept for one day by default', () => {
  assert.deepEqual(getQueueJobOptions(), {
    removeOnComplete: { age: 24 * 60 * 60 },
    removeOnFail: { age: 24 * 60 * 60 }
  })
})
