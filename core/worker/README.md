# @startupjs/worker

BullMQ-based worker package for StartupJS.

## Exports

```js
import runJob from '@startupjs/worker'
import initWorker from '@startupjs/worker/init'
import '@startupjs/worker/plugin'
```

- `runJob(name, data?, options?)`: enqueue job and always wait for result.
- `initWorker(options?)`: start workers and sync cron schedulers.
- `plugin`: auto-start + dashboard integration via StartupJS config.

## Job files

Put jobs in `workerJobs/*.js`.

```js
// workerJobs/sendEmails.js
export default async function sendEmails (data, { log, job }) {
  log('sendEmails started', { data: { jobId: job.id } })
  return { ok: true }
}

export const cron = '*/5 * * * *'
// or: export const cron = { pattern: '*/5 * * * *', data: { foo: 1 } }

// optional, default is 'default'
export const worker = 'priority' // 'default' | 'priority'

// optional singleton mode
export const singleton = true
// or: export const singleton = data => ({ userId: data.userId })
```

### Supported magic exports

- `cron`: string or `{ pattern, data }`
- `worker`: `'default' | 'priority'`
- `singleton`:
  - `true` -> one in-flight instance per job name
  - function -> return value is hashed with `JSON.stringify` and used as deduplication key

## Running jobs

```js
import runJob from '@startupjs/worker'

try {
  const result = await runJob('sendEmails', { userId: 'u1' })
  console.log(result)
} catch (error) {
  console.error(error)
}
```

`runJob` always waits for completion and throws on job error.

## Worker startup

`initWorker()` does all of this:

- starts BullMQ workers
- upserts cron schedulers for jobs with `cron`
- removes stale schedulers

By default it starts both queues: `default` and `priority`.

Use `WORKERS` env var to start only specific workers:

```bash
WORKERS=priority
# or
WORKERS=default,priority
```

## Plugin config

```js
import '@startupjs/worker/plugin'

export default {
  plugins: {
    worker: {
      server: {
        autoStart: true, // default
        concurrency: 300,
        useSeparateProcess: false,
        useWorkerThreads: true,
        jobTimeout: 30000,
        dashboard: {
          route: '/admin/queues',
          readOnlyMode: true
        }
      }
    }
  }
}
```

## Notes

- Queue names are fixed and non-configurable: `default`, `priority`.
- If a job exports an unknown `worker`, initialization fails with a list of available workers.
- Plugin `workerJobs` hook is supported for adding/overriding jobs from other plugins.
