# @startupjs/worker

Run background jobs in StartupJS with a simple API.

This package is useful when work should not block a request lifecycle, for example:
- sending emails or push notifications
- generating reports
- syncing data with external APIs
- recurring background tasks (cron)
- high-priority tasks that should be processed separately

## What You Usually Need

After installing `@startupjs/worker`, most projects only need 2 things:
1. Define jobs in `workerJobs/*.js`.
2. Call `await runJob(name, data)` from your app code.

The `worker` plugin is enabled by default, and worker auto-start is enabled by default.

`runJob()` always waits for completion and returns the job result.  
If the job throws, `runJob()` throws too, so `try/catch` works as expected.
`data` can be any JSON-serializable value (object, string, number, array, boolean, `null`).

## Quick Start

### 1) Install

```bash
yarn add @startupjs/worker
```

### 2) Create a job file

```js
// workerJobs/sendWelcomeEmail.js
export default async function sendWelcomeEmail (data, { log }) {
  log('Sending welcome email', { data: { userId: data.userId } })
  // ... your logic
  return { ok: true }
}
```

### 3) Run the job

```js
import runJob from '@startupjs/worker'

const result = await runJob('sendWelcomeEmail', { userId: 'u1' })
```

## Fire-and-forget jobs

Use `enqueueJob()` when the request should return immediately and another part
of your app will track the job status.

```js
import { enqueueJob } from '@startupjs/worker'

const jobRef = await enqueueJob('sendWelcomeEmail', { userId: 'u1' })
```

`jobRef` is serializable:

```js
{
  id: '123',
  worker: 'default',
  name: 'sendWelcomeEmail'
}
```

You can wait for it later:

```js
import { waitJob } from '@startupjs/worker'

const result = await waitJob(jobRef)
```

If you need to know whether enqueue created a new job or reused/deduped an
existing one, pass `returnMeta: true`:

```js
const result = await enqueueJob('sendWelcomeEmail', { userId: 'u1' }, {
  returnMeta: true
})

// result:
// {
//   ref: { id, worker, name },
//   created: true,
//   deduped: false,
//   skipped: false,
//   replaced: false,
//   reason: null,
//   policy: 'created',
//   duplicateOf: null
// }
```

Without `returnMeta`, `enqueueJob()` keeps the old behavior and returns only
`jobRef`.

`runJob(name, data, options)` is still available and still waits for completion.
Internally it is equivalent to `enqueueJob()` followed by `waitJob()`.

## Job status, logs and counts

```js
import {
  getJobLogs,
  getJobStatus,
  getJobsCount,
  queryJobs
} from '@startupjs/worker'

const status = await getJobStatus(jobRef)
const logs = await getJobLogs(jobRef)

const activeCount = await getJobsCount({
  trackingKey: `course:${courseId}:voiceovers`,
  states: ['waiting', 'delayed', 'active']
})

const jobs = await queryJobs({
  trackingKey: `course:${courseId}:voiceovers`,
  states: ['failed'],
  limit: 20
})
```

Use `trackingKey` when you need to query jobs by domain entity. Without a
`trackingKey`, BullMQ can count jobs by queue state, but it can not efficiently
answer domain queries like "active voiceover jobs for this course".
`getJobsCount({ name })` also requires `trackingKey`; otherwise the result would
be a capped scan instead of an exact count.

```js
await enqueueJob('generateCourseVoiceovers', { courseId }, {
  trackingKey: `course:${courseId}:voiceovers`
})
```

## Delayed jobs

```js
await enqueueJob('sendReminder', { userId }, {
  delay: 60_000
})

await enqueueJob('sendReminder', { userId }, {
  startAt: Date.now() + 60_000
})
```

Use either `delay` or `startAt`, not both.

## Per-call singleton and queue selection

Job files can still export `singleton`, but you can also set it per enqueue call:

```js
await enqueueJob('rebuildUserFeed', { userId }, {
  singleton: { key: userId }
})
```

By default duplicates return the existing in-flight job ref. For per-call
singleton you can choose a different duplicate policy:

```js
await enqueueJob('rebuildUserFeed', { userId }, {
  singleton: {
    key: userId,
    onDuplicate: 'skip' // 'return-existing' | 'skip' | 'throw'
  }
})
```

You can override the queue at runtime:

```js
await enqueueJob('sendOtp', { userId }, {
  worker: 'priority'
})
```

## Debounce and throttle

Debounce and throttle are exposed through a package-level API.
Basic debounce and leading throttle are implemented with BullMQ deduplication.
Trailing throttle keeps the first job immediate and schedules one latest-value
job at the end of the throttle window.

```js
await enqueueJob('rebuildSearchIndex', { entityId }, {
  debounce: {
    key: entityId,
    delay: 3000
  }
})

await enqueueJob('recalculateStats', { lessonId }, {
  throttle: {
    key: lessonId,
    ttl: 3000
  }
})

await enqueueJob('recalculateStats', { lessonId, value }, {
  throttle: {
    key: lessonId,
    ttl: 3000,
    trailing: true
  }
})
```

For debounce, `debounce.delay` is also used as the BullMQ job delay, so do not
pass a separate `delay` or `startAt` option.

For debounce duplicates, the default policy is `replace`, so the latest delayed
payload wins. You can opt out with `replace: false` or choose an explicit
`onDuplicate` policy:

```js
await enqueueJob('rebuildSearchIndex', { entityId }, {
  debounce: {
    key: entityId,
    delay: 3000,
    onDuplicate: 'replace' // 'replace' | 'return-existing' | 'skip' | 'throw'
  }
})
```

## Production Deployment (Important)

Default behavior:
- app server process also runs workers
- this is fine for local/dev and simple deployments

Production recommendation for larger setups:
- run a dedicated worker microservice with `npx startupjs start-worker-production`
- disable worker auto-start in your app server production process

Use `autoStartProduction: false` in app server config:

```js
// startupjs.config.js
export default {
  plugins: {
    worker: {
      server: {
        autoStartProduction: false
      }
    }
  }
}
```

Then run workers separately:

```bash
npx startupjs start-worker-production
```

This command starts workers even in production mode, because it initializes workers directly.

## Cron Jobs

Cron jobs are for tasks that must run on a schedule (for example cleanup, sync, or periodic reports).

Use cron when:
- the job should run automatically at fixed times
- you do not want to trigger it manually from app code each time

Important:
- cron does not replace manual runs
- you can still run the same job anytime with `runJob(...)`
- `cron.data` is the input payload passed to the job for scheduled runs

API:
- `export const cron = '<cron pattern>'`
- or `export const cron = { pattern: '<cron pattern>', data: <any serializable value> }`

Example without data:

```js
// workerJobs/cleanupTokens.js
export default async function cleanupTokens () {
  return { ok: true }
}

export const cron = '0 */6 * * *' // every 6 hours
```

Example with data:

```js
// workerJobs/generateReport.js
export default async function generateReport (data) {
  return { ok: true, reportType: data.reportType }
}

export const cron = {
  pattern: '0 9 * * 1', // every Monday at 09:00
  data: { reportType: 'weekly' }
}
```

The scheduled run above is equivalent to calling:

```js
await runJob('generateReport', { reportType: 'weekly' })
```

## Singleton Jobs

Singleton jobs prevent duplicate work.

Use singleton when:
- the same job should not run multiple times in parallel
- duplicate requests can happen and should collapse into one execution

There are two singleton modes:
- global singleton: one in-flight job for that job name
- keyed singleton: one in-flight job per key

What keyed singleton means:
- you return a key from `singleton(data)`
- jobs with the same key are treated as duplicates
- jobs with different keys can still run in parallel

Why keyed singleton is useful:
- avoid duplicate work for one entity (user, org, document)
- still keep concurrency across different entities

API:
- `export const singleton = true` for one global singleton per job name
- `export const singleton = (data) => value` for keyed singleton (for example per user)

Global singleton example:

```js
// workerJobs/syncCatalog.js
export default async function syncCatalog () {
  return { ok: true }
}

export const singleton = true
```

Keyed singleton example (per user):

```js
// workerJobs/rebuildUserFeed.js
export default async function rebuildUserFeed ({ userId }) {
  return { ok: true, userId }
}

export const singleton = data => ({ userId: data.userId })
```

In this example:
- `rebuildUserFeed({ userId: 'u1' })` + `rebuildUserFeed({ userId: 'u1' })` collapse into one execution
- `rebuildUserFeed({ userId: 'u1' })` and `rebuildUserFeed({ userId: 'u2' })` can run in parallel

In keyed mode, the returned value must be JSON-serializable.

## Job File API

Each file in `workerJobs` should export:
- `default`: required async/sync function
- `cron`: optional cron config
- `worker`: optional worker name (`default` or `priority`)
- `singleton`: optional deduplication config

```js
// workerJobs/exampleJob.js
export default async function exampleJob (data, { log, job }) {
  log('exampleJob started', { data: { jobId: job.id } })
  return { ok: true, input: data }
}

export const cron = '*/5 * * * *'
// or: export const cron = { pattern: '*/5 * * * *', data: { foo: 1 } }

export const worker = 'priority' // optional, default: 'default'

export const singleton = true
// or: export const singleton = data => ({ userId: data.userId })
```

## Job Context (`default` export second argument)

Your handler receives:
- `log(message, { data, err })`
- `log.warn(message, { data, err })`
- `log.error(message, { data, err })`
- `job` (raw queue job object)
- `jobRef` (serializable job reference)
- `progress(value)` (updates BullMQ job progress)
- `enqueueJob(name, data, options)`
- `waitJob(jobRef, options)`
- `getJobStatus(jobRef)`
- `backend`
- `createModel()`

Use `log(...)` instead of `console.log(...)` when you want logs visible in the queue dashboard.

When the worker backend is initialized, handlers can use model helpers:

```js
export default async function updateSomething (data, { createModel }) {
  const $ = createModel()
  // ...
  $.close()
}
```

`createModel()` throws if worker backend initialization is disabled with
`ensureBackend: false`.

## Worker Lifecycle Events

Use `events` in worker server config when you need a generic integration point
for metrics, domain status rows, notifications or custom tracking.

```js
// startupjs.config.js
export default {
  plugins: {
    worker: {
      server: {
        events: {
          onQueued: event => {},
          onDeduped: event => {},
          onStarted: event => {},
          onProgress: event => {},
          onCompleted: event => {},
          onFailed: event => {}
        }
      }
    }
  }
}
```

Each event contains:
- `ref`: serializable job ref
- `name`: job name
- `worker`: queue name
- `data`: job payload data
- `meta`: worker metadata
- `state`
- `job`: raw BullMQ job object

`onCompleted` also receives `result`, `onFailed` receives `error`, and
`onProgress` receives `progress`.

Lifecycle hooks are managed best-effort:
- hook errors are logged and do not change BullMQ job outcome
- `onStarted` / `onProgress` / `onCompleted` / `onFailed` run from parent
  BullMQ `Worker` events
- worker shutdown waits for currently pending hook promises before closing
  runtime resources

Use BullMQ job state as the source of truth and lifecycle hooks for metrics,
notifications or eventually consistent read models.

## Examples By Use Case

### 1) Simple async background task

Why: move slow work out of request handlers.

```js
// workerJobs/recalculateStats.js
export default async function recalculateStats ({ accountId }) {
  // expensive query / aggregation
  return { accountId, updated: true }
}
```

```js
// anywhere in server code
import runJob from '@startupjs/worker'

await runJob('recalculateStats', { accountId: 'a1' })
```

### 2) Cron job

Why: run periodic maintenance tasks automatically.

```js
// workerJobs/cleanupTokens.js
export default async function cleanupTokens () {
  // delete expired tokens
  return { ok: true }
}

export const cron = '0 */6 * * *' // every 6 hours
```

With data payload:

```js
export const cron = {
  pattern: '0 9 * * 1', // every Monday 09:00
  data: { dryRun: false }
}
```

### 3) Priority queue job

Why: keep urgent tasks separate from regular background load.

```js
// workerJobs/sendOtp.js
export default async function sendOtp (data) {
  // send OTP
  return { sent: true, phone: data.phone }
}

export const worker = 'priority'
```

### 4) Singleton job (global)

Why: prevent duplicate executions of the same job type.

```js
// workerJobs/syncCatalog.js
export default async function syncCatalog () {
  // sync whole catalog
  return { ok: true }
}

export const singleton = true
```

### 5) Singleton job by key (for example userId)

Why: allow parallel work for different users, but dedupe per user.

```js
// workerJobs/rebuildUserFeed.js
export default async function rebuildUserFeed ({ userId }) {
  return { ok: true, userId }
}

export const singleton = data => ({ userId: data.userId })
```

### 6) Per-call timeout override

Why: most jobs use a global timeout, but some calls need a custom value.

```js
import runJob from '@startupjs/worker'

await runJob(
  'rebuildUserFeed',
  { userId: 'u1' },
  { timeout: 60000 }
)
```

### 7) Add jobs from another plugin

Why: reusable modules can contribute their own jobs.

```js
import { createPlugin } from 'startupjs/registry'

export default createPlugin({
  name: 'my-plugin',
  server: () => ({
    workerJobs (existingJobs = {}) {
      return {
        ...existingJobs,
        pluginJob: {
          default: async function pluginJob (data) {
            return { from: 'plugin', data }
          },
          cron: { pattern: '*/10 * * * * *', data: { source: 'pluginJob' } }
        }
      }
    }
  })
})
```

## Startup and Configuration

Server-side worker options:

```js
// startupjs.config.js
export default {
  plugins: {
    worker: {
      server: {
        autoStart: true,
        autoStartProduction: true,
        concurrency: 300,
        ensureBackend: true,
        jobTimeout: 30000,
        queuePrefix: undefined,
        useSeparateProcess: false,
        useWorkerThreads: true,
        dashboard: {
          route: '/admin/queues',
          readOnlyMode: true
        }
      }
    }
  }
}
```

Option meanings:
- `autoStart` (`true` by default): auto-initialize workers on server startup.
- `autoStartProduction` (`true` by default): if `false`, workers do not auto-start when `NODE_ENV=production`.
- `concurrency` (`300`): per-worker concurrency.
- `ensureBackend` (`true`): initialize StartupJS backend before running a job. Set to `false` only for pure BullMQ jobs/tests that do not use model/backend APIs.
- `jobTimeout` (`30000` ms): default timeout for jobs.
- `queuePrefix` (`redisPrefix`): BullMQ Redis key prefix. Mostly useful for isolated tests or dedicated deployments.
- `useSeparateProcess` (`false`): execute job handlers in sandboxed child runner.
- `useWorkerThreads` (`true`): when sandbox is on, use worker threads.
- `dashboard`: queue UI settings. Provide `route` to enable the dashboard route.

## Worker Topology (`default` + `priority`)

The package has two fixed worker names:
- `default`
- `priority`

By default both start.  
To start only specific workers, use `WORKERS` env var (comma-separated):

```bash
WORKERS=default
WORKERS=priority
WORKERS=default,priority
```

This enables setups like:
- app servers enqueue jobs
- one worker service handles both queues
- another dedicated worker service handles only `priority`

Common commands:

```bash
# development / staging worker process (current NODE_ENV)
npx startupjs start-worker

# production worker process
npx startupjs start-worker-production

# start only priority workers in production
WORKERS=priority npx startupjs start-worker-production
```

If you run dedicated worker services in all environments, set `autoStart: false`.
If you split only in production, set `autoStartProduction: false` so dev/stage behavior stays unchanged.

## Public Exports

```js
import runJob, {
  cancelJob,
  enqueueJob,
  getJobLogs,
  getJobStatus,
  getJobsCount,
  queryJobs,
  waitJob
} from '@startupjs/worker'
import initWorker from '@startupjs/worker/init'
import '@startupjs/worker/plugin'
```

- `@startupjs/worker`: `runJob(name, data?, options?)`
- `@startupjs/worker`: named job helpers listed above
- `@startupjs/worker/init`: `initWorker(options?)`
- `@startupjs/worker/plugin`: StartupJS plugin export used by plugin registry

## Error Handling and Results

- `runJob` returns the value returned by your job handler.
- If your job throws, `runJob` throws.
- If the job does not exist, `runJob` throws with a list of available jobs.
- If a job declares unknown `worker`, initialization fails and lists supported workers.

## Timeout Behavior

- Timeouts are enforced as promise timeouts for all modes.
- In same-process mode, timed-out code cannot be force-killed; execution may continue in background.
- In separate-process mode, timeout can terminate the sandbox runner for harder isolation.

## Technical Details (Optional)

Under the hood this package uses BullMQ, but you usually do not need to care.

Implementation summary:
- Jobs are discovered from `workerJobs/*.js`.
- Additional jobs can be injected through StartupJS `workerJobs` plugin hook.
- `initWorker` starts workers, syncs cron schedulers, and removes stale schedulers.
- `runJob` enqueues a job and waits for completion before returning.
- Queue names are fixed to `default` and `priority`.
