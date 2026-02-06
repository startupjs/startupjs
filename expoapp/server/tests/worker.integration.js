import { getRedis, getRedisOptions, redisPrefix } from 'startupjs/server'
import runJob from '@startupjs/worker'
import initWorker, { closeWorkers } from '@startupjs/worker/init'
import assert from 'assert'
import { Queue } from 'bullmq'

const DEFAULT_QUEUE = 'default'
const PRIORITY_QUEUE = 'priority'
const VALID_WORKERS = [DEFAULT_QUEUE, PRIORITY_QUEUE]
const USE_SEPARATE_PROCESS = process.env.WORKER_TEST_USE_SEPARATE_PROCESS === 'true'

const JOBS = {
  echo: 'integrationEcho',
  throws: 'integrationThrows',
  priority: 'integrationPriority',
  sleep: 'integrationSleep',
  singletonGlobal: 'integrationSingletonGlobal',
  singletonByUser: 'integrationSingletonByUser',
  singletonUnserializable: 'integrationSingletonUnserializable',
  cronDefault: 'integrationCronDefault',
  cronPriority: 'integrationCronPriority',
  cronString: 'integrationCronString',
  plugin: 'integrationPluginJob',
  pluginAsync: 'integrationPluginAsync',
  pluginCron: 'integrationPluginCron',
  pluginCronTransient: 'integrationPluginCronTransient'
}

const DEDUP_KEYS = [
  'singleton:default:integrationSingletonGlobal',
  'singleton:default:integrationSingletonByUser:{"userId":"u1"}',
  'singleton:default:integrationSingletonByUser:{"userId":"u2"}'
]

const MANAGED_ENV_KEYS = [
  'WORKERS',
  'WORKER_TEST_INVALID_JOB',
  'WORKER_TEST_ENABLE_EXTRA_PLUGIN_CRON'
]

try {
  await run()
  process.exit(0)
} catch (error) {
  console.error(error)
  process.exit(1)
}

async function run () {
  const initialEnv = snapshotEnv(MANAGED_ENV_KEYS)

  try {
    await closeWorkers().catch(() => {})
    await cleanupQueues()

    await assertRejects(
      () => initWorker(withRuntimeOptions({ workers: ['unknown-worker'] })),
      /Unknown worker "unknown-worker"/
    )

    await withEnv({ WORKERS: ' , ' }, async () => {
      await assertRejects(
        () => initWorker(withRuntimeOptions()),
        /WORKERS env var is empty/
      )
    })

    await withEnv({ WORKERS: 'default, default, priority ' }, async () => {
      const result = await initWorker(withRuntimeOptions({ concurrency: 1 }))
      assert.deepStrictEqual(result.workers, [DEFAULT_QUEUE, PRIORITY_QUEUE])
      await closeWorkers()
    })

    await withEnv({ WORKERS: 'priority' }, async () => {
      const result = await initWorker(withRuntimeOptions({ concurrency: 1 }))
      assert.deepStrictEqual(result.workers, [PRIORITY_QUEUE])
      await closeWorkers()
    })

    await withEnv({ WORKER_TEST_INVALID_JOB: 'worker' }, async () => {
      await assertRejects(
        () => initWorker(withRuntimeOptions({ workers: [DEFAULT_QUEUE] })),
        /Unknown worker "does-not-exist"/
      )
    })

    await withEnv({ WORKER_TEST_INVALID_JOB: 'cron' }, async () => {
      await assertRejects(
        () => initWorker(withRuntimeOptions({ workers: [DEFAULT_QUEUE] })),
        /has invalid cron export/
      )
    })

    await withEnv({ WORKER_TEST_INVALID_JOB: 'singleton' }, async () => {
      await assertRejects(
        () => initWorker(withRuntimeOptions({ workers: [DEFAULT_QUEUE] })),
        /has invalid singleton export/
      )
    })

    await withEnv({ WORKER_TEST_ENABLE_EXTRA_PLUGIN_CRON: 'true' }, async () => {
      const result = await initWorker(withRuntimeOptions({
        workers: VALID_WORKERS,
        concurrency: 5,
        jobTimeout: 80
      }))

      assert.deepStrictEqual(result.workers.sort(), VALID_WORKERS.slice().sort())

      await assertRejects(() => runJob(''), /"name" must be a non-empty string/)
      await assertRejects(() => runJob('missingJob', {}), /job "missingJob" not found/)
      await assertRejects(() => runJob(JOBS.echo, null), /"data" must be an object/)

      const echo = await runJob(JOBS.echo, { value: 42 })
      assert.strictEqual(echo.ok, true)
      assert.strictEqual(echo.data.type, JOBS.echo)
      assert.strictEqual(echo.data.value, 42)
      assert.strictEqual(echo.data.timeout, 80)

      await assertRejects(() => runJob(JOBS.throws), /integration-failure/)

      const priorityResult = await runJob(JOBS.priority, { marker: 'p1' })
      assert.strictEqual(priorityResult.queue, PRIORITY_QUEUE)
      assert.strictEqual(priorityResult.data.marker, 'p1')

      const pluginResult = await runJob(JOBS.plugin, { marker: 'plugin' })
      assert.strictEqual(pluginResult.from, 'plugin')
      assert.strictEqual(pluginResult.data.type, JOBS.plugin)

      const pluginAsyncResult = await runJob(JOBS.pluginAsync, { marker: 'plugin-async' })
      assert.strictEqual(pluginAsyncResult.from, 'plugin-async')
      assert.strictEqual(pluginAsyncResult.data.type, JOBS.pluginAsync)

      await assertRejects(
        () => runJob(JOBS.sleep, { ms: 140 }),
        /timed out after 80ms/
      )

      const sleepOverride = await runJob(JOBS.sleep, { ms: 140 }, { timeout: 250 })
      assert.deepStrictEqual(sleepOverride, { ok: true, ms: 140 })

      if (USE_SEPARATE_PROCESS) {
        const parallelResults = await Promise.allSettled([
          runJob(JOBS.sleep, { ms: 300, i: 0 }, { timeout: 50 }),
          ...Array.from({ length: 9 }, (_, index) =>
            runJob(JOBS.sleep, { ms: 120, i: index + 1 }, { timeout: 1000 })
          )
        ])

        const rejected = parallelResults.filter(result => result.status === 'rejected')
        const fulfilled = parallelResults.filter(result => result.status === 'fulfilled')

        assert.strictEqual(rejected.length, 1)
        assert(/timed out after 50ms/.test(rejected[0].reason.message))
        assert.strictEqual(fulfilled.length, 9)
      }

      const [singletonGlobalA, singletonGlobalB] = await Promise.all([
        runJob(JOBS.singletonGlobal, { marker: 'same' }),
        runJob(JOBS.singletonGlobal, { marker: 'same' })
      ])
      assert.strictEqual(singletonGlobalA.runId, singletonGlobalB.runId)

      const singletonGlobalC = await runJob(JOBS.singletonGlobal, { marker: 'next' })
      assert.strictEqual(typeof singletonGlobalC.runId, 'number')
      assert(singletonGlobalC.runId >= 1)

      const [singletonUser1A, singletonUser1B, singletonUser2] = await Promise.all([
        runJob(JOBS.singletonByUser, { userId: 'u1' }),
        runJob(JOBS.singletonByUser, { userId: 'u1' }),
        runJob(JOBS.singletonByUser, { userId: 'u2' })
      ])
      assert.strictEqual(singletonUser1A.runId, singletonUser1B.runId)
      assert.strictEqual(singletonUser2.userId, 'u2')

      await assertRejects(
        () => runJob(JOBS.singletonUnserializable, {}),
        /circular/i
      )

      const defaultSchedulers = await getSchedulerNames(DEFAULT_QUEUE)
      const prioritySchedulers = await getSchedulerNames(PRIORITY_QUEUE)

      assert(defaultSchedulers.includes(JOBS.cronDefault))
      assert(defaultSchedulers.includes(JOBS.cronString))
      assert(defaultSchedulers.includes(JOBS.pluginCronTransient))
      assert(prioritySchedulers.includes(JOBS.cronPriority))
      assert(prioritySchedulers.includes(JOBS.pluginCron))
    })

    await initWorker(withRuntimeOptions({
      workers: VALID_WORKERS,
      concurrency: 5
    }))

    const defaultSchedulersAfterCleanup = await getSchedulerNames(DEFAULT_QUEUE)
    assert(!defaultSchedulersAfterCleanup.includes(JOBS.pluginCronTransient))
    assert(defaultSchedulersAfterCleanup.includes(JOBS.cronDefault))

    console.log('[worker.integration] All checks passed')
  } finally {
    restoreEnv(initialEnv)
    await closeWorkers().catch(() => {})
    await cleanupQueues().catch(() => {})
  }
}

function withRuntimeOptions (options = {}) {
  return {
    ...options,
    useSeparateProcess: USE_SEPARATE_PROCESS
  }
}

function createQueue (name) {
  return new Queue(name, {
    prefix: redisPrefix,
    connection: getRedis({
      ...getRedisOptions({ addPrefix: false }),
      maxRetriesPerRequest: null,
      enableOfflineQueue: false
    })
  })
}

async function getSchedulerNames (queueName) {
  const queue = createQueue(queueName)

  try {
    const schedulers = await queue.getJobSchedulers()
    return schedulers.map(scheduler => scheduler.name)
  } finally {
    await queue.close()
  }
}

async function cleanupQueues () {
  await Promise.all([cleanupQueue(DEFAULT_QUEUE), cleanupQueue(PRIORITY_QUEUE)])
}

async function cleanupQueue (queueName) {
  const queue = createQueue(queueName)

  try {
    const schedulers = await queue.getJobSchedulers()
    await Promise.all(schedulers.map(scheduler => queue.removeJobScheduler(scheduler.name)))

    await queue.clean(0, 1000, 'wait')
    await queue.clean(0, 1000, 'active')
    await queue.clean(0, 1000, 'delayed')
    await queue.clean(0, 1000, 'completed')
    await queue.clean(0, 1000, 'failed')

    if (typeof queue.removeDeduplicationKey === 'function') {
      await Promise.all(DEDUP_KEYS.map(key => queue.removeDeduplicationKey(key)))
    }
  } finally {
    await queue.close()
  }
}

async function withEnv (nextValues, fn) {
  const previous = snapshotEnv(Object.keys(nextValues))

  try {
    for (const key in nextValues) {
      const value = nextValues[key]
      if (value == null) {
        delete process.env[key]
      } else {
        process.env[key] = value
      }
    }

    await fn()
  } finally {
    restoreEnv(previous)
  }
}

function snapshotEnv (keys) {
  const snapshot = {}
  for (const key of keys) snapshot[key] = process.env[key]
  return snapshot
}

function restoreEnv (snapshot) {
  for (const key in snapshot) {
    const value = snapshot[key]
    if (value == null) {
      delete process.env[key]
    } else {
      process.env[key] = value
    }
  }
}

async function assertRejects (fn, pattern) {
  let error

  try {
    await fn()
  } catch (err) {
    error = err
  }

  assert(error, `Expected error matching ${pattern}, but nothing was thrown`)

  const message = error instanceof Error ? error.message : String(error)
  assert(pattern.test(message), `Expected error message to match ${pattern}, got: ${message}`)
}
