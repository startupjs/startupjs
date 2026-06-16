import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildEnqueueConfig,
  getSingletonDeduplicationId,
  normalizeLimit,
  normalizeStates,
  normalizeTrackingKey
} from '../jobOptions.js'

test('builds default enqueue payload', async () => {
  const config = await buildEnqueueConfig({
    name: 'sendEmail',
    data: { userId: 'u1' },
    options: {},
    jobDefinition: {
      name: 'sendEmail',
      worker: 'default'
    },
    defaultTimeout: 30000,
    caller: 'test'
  })

  assert.equal(config.worker, 'default')
  assert.equal(config.payload.type, 'sendEmail')
  assert.equal(config.payload.timeout, 30000)
  assert.deepEqual(config.payload.data, { userId: 'u1' })
  assert.equal(config.payload.meta.worker, 'default')
  assert.deepEqual(config.jobOptions, {})
})

test('supports runtime worker, trackingKey, delay and known job options', async () => {
  const config = await buildEnqueueConfig({
    name: 'generate',
    data: {},
    options: {
      worker: 'priority',
      trackingKey: { entity: 'course', id: 'c1' },
      delay: 1000,
      priority: 10,
      attempts: 3,
      removeOnComplete: { age: 60 }
    },
    jobDefinition: {
      name: 'generate',
      worker: 'default'
    },
    defaultTimeout: 30000,
    caller: 'test'
  })

  assert.equal(config.worker, 'priority')
  assert.equal(config.trackingKey, '{"entity":"course","id":"c1"}')
  assert.equal(config.payload.meta.trackingKey, '{"entity":"course","id":"c1"}')
  assert.equal(config.payload.meta.worker, 'priority')
  assert.equal(config.jobOptions.delay, 1000)
  assert.equal(config.jobOptions.priority, 10)
  assert.equal(config.jobOptions.attempts, 3)
  assert.deepEqual(config.jobOptions.removeOnComplete, { age: 60 })
})

test('supports module singleton and per-call singleton', async () => {
  assert.equal(
    await getSingletonDeduplicationId({
      name: 'sync',
      worker: 'default',
      singleton: true
    }, {}),
    'singleton:default:sync'
  )

  assert.equal(
    await getSingletonDeduplicationId({
      name: 'sync',
      worker: 'default',
      singleton: data => ({ id: data.id, type: data.type })
    }, { type: 'course', id: 'c1' }),
    'singleton:default:sync:{"id":"c1","type":"course"}'
  )

  const config = await buildEnqueueConfig({
    name: 'sync',
    data: {},
    options: {
      singleton: { key: 'manual-key' }
    },
    jobDefinition: {
      name: 'sync',
      worker: 'default',
      singleton: true
    },
    defaultTimeout: 30000,
    caller: 'test'
  })

  assert.equal(config.jobOptions.deduplication.id, 'singleton:default:sync:manual-key')
})

test('maps debounce and leading throttle to BullMQ deduplication', async () => {
  const debounceConfig = await buildEnqueueConfig({
    name: 'search',
    data: {},
    options: {
      debounce: {
        key: 'user:u1',
        delay: 300
      }
    },
    jobDefinition: {
      name: 'search',
      worker: 'default'
    },
    defaultTimeout: 30000,
    caller: 'test'
  })

  assert.equal(debounceConfig.jobOptions.delay, 300)
  assert.deepEqual(debounceConfig.jobOptions.deduplication, {
    id: 'debounce:default:search:user:u1',
    ttl: 300,
    extend: true,
    replace: true
  })

  const throttleConfig = await buildEnqueueConfig({
    name: 'search',
    data: {},
    options: {
      throttle: {
        key: 'user:u1',
        ttl: 300
      }
    },
    jobDefinition: {
      name: 'search',
      worker: 'default'
    },
    defaultTimeout: 30000,
    caller: 'test'
  })

  assert.deepEqual(throttleConfig.jobOptions.deduplication, {
    id: 'throttle:default:search:user:u1',
    ttl: 300
  })
})

test('rejects unsupported or ambiguous options', async () => {
  await assert.rejects(() => buildEnqueueConfig({
    name: 'job',
    data: {},
    options: {
      delay: 1,
      startAt: Date.now()
    },
    jobDefinition: {
      name: 'job',
      worker: 'default'
    },
    defaultTimeout: 30000,
    caller: 'test'
  }), /either "delay" or "startAt"/)

  await assert.rejects(() => buildEnqueueConfig({
    name: 'job',
    data: {},
    options: {
      delay: 1,
      debounce: {
        key: 'k',
        delay: 1
      }
    },
    jobDefinition: {
      name: 'job',
      worker: 'default'
    },
    defaultTimeout: 30000,
    caller: 'test'
  }), /do not pass "delay" or "startAt" with debounce/)

  await assert.rejects(() => buildEnqueueConfig({
    name: 'job',
    data: {},
    options: {
      throttle: {
        key: 'k',
        ttl: 1,
        trailing: true
      }
    },
    jobDefinition: {
      name: 'job',
      worker: 'default'
    },
    defaultTimeout: 30000,
    caller: 'test'
  }), /throttle.trailing is not supported yet/)
})

test('normalizes states and tracking keys', () => {
  assert.deepEqual(normalizeStates('active'), ['active'])
  assert.deepEqual(normalizeStates(['active', '', ' delayed ']), ['active', 'delayed'])
  assert.equal(normalizeTrackingKey({ b: 2, a: 1 }), '{"a":1,"b":2}')
})

test('normalizes limits', () => {
  assert.equal(normalizeLimit(undefined), 100)
  assert.equal(normalizeLimit('10'), 10)
  assert.equal(normalizeLimit(10.8), 10)
  assert.equal(normalizeLimit(0), 100)
  assert.equal(normalizeLimit('bad', 10000), 10000)
})
