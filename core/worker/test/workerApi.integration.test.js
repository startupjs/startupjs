import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const JOBS = {
  echo: `
    export default async function echo (data) {
      return { ok: true, data }
    }
  `,
  fail: `
    export default async function fail () {
      throw new Error('expected failure')
    }
  `,
  logAndProgress: `
    export default async function logAndProgress (data, {
      getJobStatus,
      jobRef,
      log,
      progress
    }) {
      await log('integration log message', { data })
      await progress({ percent: 50 })

      const status = await getJobStatus(jobRef)
      return {
        jobRef,
        progress: status.progress
      }
    }
  `,
  parent: `
    export default async function parent (data, { enqueueJob, waitJob }) {
      const childRef = await enqueueJob('echo', { from: 'parent' }, {
        trackingKey: data.trackingKey
      })

      return await waitJob(childRef)
    }
  `,
  priorityOnly: `
    export const worker = 'priority'

    export default async function priorityOnly (data) {
      return { worker: 'priority', data }
    }
  `,
  slow: `
    export default async function slow (data) {
      await new Promise(resolve => setTimeout(resolve, data.delay || 50))
      return data
    }
  `
}

test('worker public API with Redis and BullMQ', async t => {
  const api = await setupWorkerRuntime(t)

  await t.test('runJob keeps wait-and-return behavior', async () => {
    const result = await api.runJob('echo', { value: 1 })

    assert.deepEqual(result, {
      ok: true,
      data: { value: 1 }
    })
  })

  await t.test('enqueueJob returns jobRef and waitJob returns result', async () => {
    const ref = await api.enqueueJob('echo', { value: 2 }, {
      trackingKey: api.trackingKey('basic')
    })

    assert.equal(typeof ref.id, 'string')
    assert.equal(ref.name, 'echo')
    assert.equal(ref.worker, 'default')

    const result = await api.waitJob(ref, { timeout: 5000 })
    assert.deepEqual(result, {
      ok: true,
      data: { value: 2 }
    })

    const status = await api.getJobStatus(ref)
    assert.equal(status.state, 'completed')
    assert.deepEqual(status.result, result)
  })

  await t.test('waitJob throws enriched error for failed jobs', async () => {
    const ref = await api.enqueueJob('fail')

    await assert.rejects(
      () => api.waitJob(ref, { timeout: 5000 }),
      error => {
        assert.match(error.message, /expected failure/)
        assert.equal(error.job.ref.id, ref.id)
        assert.equal(error.job.state, 'failed')
        return true
      }
    )

    const status = await api.getJobStatus(ref)
    assert.equal(status.state, 'failed')
    assert.match(status.error, /expected failure/)
  })

  await t.test('trackingKey query/count works and cancelJob removes delayed jobs', async () => {
    const trackingKey = api.trackingKey('delayed')
    const ref = await api.enqueueJob('echo', { delayed: true }, {
      trackingKey,
      delay: 5000
    })

    assert.equal(await api.getJobsCount({
      trackingKey,
      name: 'echo',
      states: ['delayed']
    }), 1)

    await assert.rejects(
      () => api.getJobsCount({
        name: 'echo',
        states: ['delayed']
      }),
      /"name" filter requires "trackingKey"/
    )

    const jobs = await api.queryJobs({
      trackingKey,
      states: ['delayed'],
      limit: 10
    })

    assert.equal(jobs.length, 1)
    assert.equal(jobs[0].ref.id, ref.id)

    const cancelResult = await api.cancelJob(ref)
    assert.equal(cancelResult.cancelled, true)
    assert.equal(cancelResult.state, 'delayed')

    assert.equal(await api.getJobsCount({
      trackingKey,
      states: ['delayed', 'waiting']
    }), 0)
  })

  await t.test('startAt schedules delayed job and waitJob resolves it', async () => {
    const ref = await api.enqueueJob('echo', { scheduled: true }, {
      startAt: Date.now() + 100
    })

    const initialStatus = await api.getJobStatus(ref)
    assert.ok(['delayed', 'waiting'].includes(initialStatus.state))

    const result = await api.waitJob(ref, { timeout: 5000 })
    assert.deepEqual(result, {
      ok: true,
      data: { scheduled: true }
    })
  })

  await t.test('runtime worker override and module worker selection work', async () => {
    assert.deepEqual(await api.runJob('echo', { via: 'priority' }, {
      worker: 'priority'
    }), {
      ok: true,
      data: { via: 'priority' }
    })

    assert.deepEqual(await api.runJob('priorityOnly', { value: 1 }), {
      worker: 'priority',
      data: { value: 1 }
    })
  })

  await t.test('handler context exposes logs, progress and jobRef', async () => {
    const ref = await api.enqueueJob('logAndProgress', { value: 3 })
    const result = await api.waitJob(ref, { timeout: 5000 })

    assert.equal(result.jobRef.id, ref.id)
    assert.deepEqual(result.progress, { percent: 50 })

    const status = await api.getJobStatus(ref)
    assert.deepEqual(status.progress, { percent: 50 })

    const logs = await api.getJobLogs(ref)
    assert.equal(logs.count, 1)
    assert.match(logs.logs[0], /integration log message/)
  })

  await t.test('handler context can enqueue and wait for child jobs', async () => {
    const trackingKey = api.trackingKey('child')
    const result = await api.runJob('parent', { trackingKey })

    assert.deepEqual(result, {
      ok: true,
      data: { from: 'parent' }
    })

    assert.equal(await api.getJobsCount({
      trackingKey,
      states: ['completed']
    }), 1)
  })

  await t.test('per-call singleton deduplicates delayed jobs', async () => {
    const singleton = { key: api.trackingKey('singleton') }
    const firstRef = await api.enqueueJob('echo', { value: 1 }, {
      delay: 5000,
      singleton
    })
    const secondRef = await api.enqueueJob('echo', { value: 2 }, {
      delay: 5000,
      singleton
    })

    assert.equal(secondRef.id, firstRef.id)
    await api.cancelJob(firstRef)
  })

  await t.test('debounce replaces delayed payload', async () => {
    const key = api.trackingKey('debounce')

    const firstRef = await api.enqueueJob('echo', { value: 1 }, {
      debounce: {
        key,
        delay: 100
      }
    })
    const secondRef = await api.enqueueJob('echo', { value: 2 }, {
      debounce: {
        key,
        delay: 100
      }
    })

    const result = await api.waitJob(secondRef, { timeout: 5000 })
    assert.deepEqual(result, {
      ok: true,
      data: { value: 2 }
    })

    if (firstRef.id !== secondRef.id) {
      assert.equal((await api.getJobStatus(firstRef)).state, 'unknown')
    }
  })
})

async function setupWorkerRuntime (t) {
  const previousCwd = process.cwd()
  const previousRedisUrl = process.env.REDIS_URL
  const tmpDir = await mkdtemp(join(tmpdir(), 'startupjs-worker-'))
  const jobsDir = join(tmpDir, 'workerJobs')
  const queuePrefix = `startupjs-worker-test:${process.pid}:${Date.now()}`

  await mkdir(jobsDir)
  await writeFile(join(tmpDir, 'package.json'), JSON.stringify({
    name: 'startupjs-worker-integration-test',
    private: true,
    type: 'module'
  }))
  await Promise.all(Object.entries(JOBS).map(([name, source]) => {
    return writeFile(join(jobsDir, `${name}.js`), source)
  }))

  process.chdir(tmpDir)
  process.env.REDIS_URL ||= 'redis://127.0.0.1:6379'

  const workerApi = await import('../index.js')
  const initWorkerModule = await import('../init.js')
  const runtimeModule = await import('../runtime.js')
  const trackingModule = await import('../tracking.js')

  runtimeModule.setRuntimeOptionsOverrides({
    concurrency: 10,
    ensureBackend: false,
    jobTimeout: 5000,
    queuePrefix,
    useSeparateProcess: false
  })

  await initWorkerModule.default({
    concurrency: 10,
    ensureBackend: false,
    jobTimeout: 5000,
    queuePrefix,
    useSeparateProcess: false,
    workers: ['default', 'priority']
  })

  t.after(async () => {
    await initWorkerModule.closeWorkers({ force: true })
    await trackingModule.closeTrackingRedis()
    await removeRedisKeys(queuePrefix)
    await runtimeModule.closeRuntimeResources()
    await closeTeamplayBackendResources()
    if (previousRedisUrl == null) {
      delete process.env.REDIS_URL
    } else {
      process.env.REDIS_URL = previousRedisUrl
    }
    process.chdir(previousCwd)
    await rm(tmpDir, { recursive: true, force: true })
  })

  return {
    ...workerApi,
    queuePrefix,
    trackingKey: suffix => `${queuePrefix}:${suffix}:${Date.now()}`
  }
}

async function closeTeamplayBackendResources () {
  const backendUrl = await import.meta.resolve('@teamplay/backend')
  const redisModule = await import(new URL('./redis/index.js', backendUrl).href)
  const dbModule = await import(new URL('./db/index.js', backendUrl).href)

  await new Promise(resolve => {
    if (!redisModule.pubsub?.close) return resolve()
    redisModule.pubsub.close(() => resolve())
  })

  redisModule.redis?.disconnect?.()
  redisModule.redisObserver?.disconnect?.()

  await new Promise(resolve => {
    if (!dbModule.sqlite?.close) return resolve()
    dbModule.sqlite.close(() => resolve())
  })

  await dbModule.mongoClient?.close?.()
}

async function removeRedisKeys (queuePrefix) {
  const { getRedis, getRedisOptions } = await import('startupjs/server')
  const redis = getRedis({
    ...getRedisOptions({ addPrefix: false })
  })

  try {
    let cursor = '0'

    do {
      const [nextCursor, keys] = await redis.scan(
        cursor,
        'MATCH',
        `${queuePrefix}:*`,
        'COUNT',
        1000
      )

      if (keys.length) await redis.del(keys)
      cursor = nextCursor
    } while (cursor !== '0')
  } finally {
    await redis.quit().catch(() => {
      redis.disconnect()
    })
  }
}
