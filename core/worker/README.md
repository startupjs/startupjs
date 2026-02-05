# @startupjs/worker

Worker system based on BullMQ for background job processing with cron scheduling.

## Features

- **Cron Scheduling**: Schedule jobs using cron patterns
- **Background Processing**: Process jobs in background with configurable concurrency
- **Plugin Integration**: Plugins can add and modify jobs through hooks
- **File-based Jobs**: Define jobs in `workerJobs/` folder
- **Redis Integration**: Uses Redis for job queue management
- **Singleton Jobs**: Prevent duplicate job execution with unique IDs
- **Throttled Jobs**: Throttle job execution to prevent overwhelming the system
- **Dashboard Monitoring**: Built-in Bull Board dashboard for job monitoring
- **Separate Process Support**: Run worker in separate process for better isolation
- **Worker Threads**: Use worker threads for improved performance
- **Job Timeouts**: Configurable job execution timeouts
- **Graceful Shutdown**: Proper cleanup on process termination

## Installation

```bash
yarn add @startupjs/worker bullmq redis
```

### Available Exports

The package provides several exports for different use cases:

```js
// Main plugin
import '@startupjs/worker/plugin'

// Dashboard route initialization
import initDashboardRoute from '@startupjs/worker/initDashboardRoute'

// Job utilities
import addSingletonJob from '@startupjs/worker/addSingletonJob'
import addThrottledJob from '@startupjs/worker/addThrottledJob'

// Queue management
import createQueue from '@startupjs/worker/createQueue'
import createWorker from '@startupjs/worker/createWorker'

// Redis utilities
import getQueueRedis from '@startupjs/worker/getQueueRedis'
import getWorkerRedis from '@startupjs/worker/getWorkerRedis'
```

## Configuration

Add to your `startupjs.config.js`:

```js
import '@startupjs/worker/plugin'

export default {
  features: { enableServer: true },
  plugins: {
    worker: {
      server: {
        // Optional configuration
        autoStart: true,
        dashboard: {
          route: '/admin/queues',
          readOnlyMode: true
        }
      }
    }
  }
}
```

## Environment Variables

Create `.env` file:

```env
# Redis Configuration
REDIS_URL=redis://localhost:6379
ENABLE_REDIS=true

# Worker Configuration
QUEUE_NAME=your-app-queue
CONCURRENCY=300
JOB_TIMEOUT=30000
USE_SEPARATE_PROCESS=false
USE_WORKER_THREADS=true
AUTO_START=true

# Optional: Custom Redis settings
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-password
REDIS_DB=0
```

### Default Values

If environment variables are not set, the following defaults are used:

- `QUEUE_NAME`: (no default; must be set explicitly)
- `CONCURRENCY`: `300`
- `JOB_TIMEOUT`: `30000` (30 seconds)
- `USE_SEPARATE_PROCESS`: `false`
- `USE_WORKER_THREADS`: `true`
- `AUTO_START`: `true`

## Adding Jobs

### Method 1: File-based Jobs (Recommended)

Create files in `workerJobs/` folder. Each file should export:

- `default`: The job handler function
- `cron`: Cron pattern for scheduling (optional). Can be:
  - A string with the cron pattern (e.g., `'0 2 * * *'`)
  - An object with `pattern` (required) and optional `jobData` (e.g., `{ pattern: '0 */6 * * *', jobData: { priority: 'high' } }`)

### Method 2: Plugin Job Files

Plugins can provide job files through the `workerJobs` hook:

```js
// In your plugin
export default createPlugin({
  name: 'myPlugin',
  server: () => ({
    workerJobs: async (existingJobs = {}) => {
      // Import your job file
      const job = await import('./workerJobs/myTask.js')

      return {
        ...existingJobs,
        'myTask': job
      }
    }
  })
})
```

**Plugin job file format:**
```js
// workerJobs/myTask.js (same format as project tasks!)
export default async function myTask(jobData) {
  console.log('Running my task...')
  // Your task logic here
}

// cron can be a string
export const cron = '0 */6 * * *' // Every 6 hours

// or an object with pattern and optional jobData
export const cron = {
  pattern: '0 */6 * * *',
  jobData: { priority: 'high' }
}
```

**Example: `workerJobs/cleanup.js`**

```js
export default async function cleanupJob(jobData) {
  console.log('Running cleanup job...')
  // Your cleanup logic here
}

export const cron = '0 2 * * *' // Run daily at 2 AM
```

**Example: `workerJobs/sendEmails.js`**

```js
export default async function sendEmails(jobData) {
  const { userId, template } = jobData
  console.log(`Sending email to user ${userId} with template ${template}`)
  // Your email logic here
}

export const cron = '*/5 * * * *' // Run every 5 minutes
```

**Example: `workerJobs/processData.js` with custom job data**

```js
export default async function processData(jobData) {
  const { dataId, priority } = jobData
  console.log(`Processing data: ${dataId} with priority: ${priority}`)
  // Your processing logic here
}

export const cron = {
  pattern: '0 */6 * * *',  // Every 6 hours
  jobData: {               // Default data for this job
    priority: 'high',
    batchSize: 100
  }
}
```

### Method 3: Manual Job Execution

For jobs without cron (manual execution only):

```js
// workerJobs/processData.js
export default async function processData(jobData) {
  const { dataId } = jobData
  console.log(`Processing data: ${dataId}`)
  // Your processing logic here
}

// No cron export = manual execution only
```

## Advanced Job Types

### Singleton Jobs

Singleton jobs prevent duplicate execution by using unique IDs. Only one instance of a job with the same `uniqId` can run at a time.

```js
import addSingletonJob from '@startupjs/worker/addSingletonJob'

// Add a singleton job
const { job, status, data, error } = await addSingletonJob('processUser', {
  uniqId: 'user-123',
  userId: 123,
  action: 'update'
}, {
  waitForResult: true
})

console.log('Status:', status) // 'new' or 'existing'
```

### Throttled Jobs

Throttled jobs delay execution when the same job is already running, preventing system overload.

```js
import addThrottledJob from '@startupjs/worker/addThrottledJob'

// Add a throttled job
const { job, status } = await addThrottledJob('sendNotification', {
  uniqId: 'user-notifications',
  userId: 123,
  message: 'Hello!'
}, {
  trailing: true,
  waitForResult: false
})
```

## Dashboard Monitoring

The worker includes a built-in dashboard for monitoring job queues:

```js
// In startupjs.config.js
plugins: {
  worker: {
    server: {
      dashboard: {
        route: '/admin/queues',     // Dashboard URL
        readOnlyMode: true          // Prevent job manipulation
      }
    }
  }
}
```

Access the dashboard at `http://localhost:3000/admin/queues` to:
- View job status and progress
- Monitor job failures and retries
- See job execution history
- Manage job queues

## Plugin Integration

Plugins can add or modify jobs through the `workerJobs` hook:

```js
// In your plugin
export default createPlugin({
  name: 'myPlugin',
  server: () => ({
    workerJobs: (existingJobs) => {
      return {
        ...existingJobs,
        'myPlugin-customJob': {
          default: async (jobData) => {
            console.log('Custom plugin job running...')
          },
          // cron can be a string
          cron: '0 */6 * * *' // Every 6 hours
          // or an object: cron: { pattern: '0 */6 * * *', jobData: {...} }
        }
      }
    }
  })
})
```

### Modifying Existing Jobs

Plugins can modify existing jobs from `workerJobs/` folder:

```js
workerJobs: (existingJobs) => {
  return {
    ...existingJobs,
    'cleanup': {
      ...existingJobs.cleanup,
      // Override the cron schedule (can be string or object)
      cron: '0 3 * * *' // or { pattern: '0 3 * * *', jobData: {...} }
    }
  }
}
```

## Job Data

Jobs receive data in the following format:

```js
{
  type: 'jobName',           // Job type identifier
  uniqId: 'unique-id',       // Unique identifier for singleton/throttled jobs
  timeout: 30000,            // Job timeout in milliseconds
  // ... custom jobData
}
```

### Job Handler Function Signature

Job handler functions receive two parameters:

```js
export default async function myJob(jobData, context) {
  const { log, job } = context

  // Use the provided log function for consistent logging
  log('Starting job execution...')

  // Access job metadata
  console.log('Job ID:', job.id)
  console.log('Job type:', jobData.type)

  // Your job logic here
}
```

The `context` object provides:
- `log(message)`: Logging function with job context
- `job`: BullMQ job object with full job metadata

## Error Handling

Jobs that fail will be retried based on the retry configuration. Check logs for error details:

```
[@startupjs/worker] Error in job 'cleanup': Error message here
```

## Monitoring

The worker provides detailed logging:

```
[@startupjs/worker] Job 'cleanup' completed successfully
[@startupjs/worker] Error in job 'cleanup': Error message here
```

### Logging in Jobs

Use the provided `log` function in your job handlers for consistent logging:

```js
export default async function myJob(jobData, { log }) {
  log('Starting job execution...')

  try {
    // Your job logic
    log('Job completed successfully')
  } catch (error) {
    log('Job failed: ' + error.message)
    throw error
  }
}
```

### Job Status Tracking

Monitor job execution through the dashboard or programmatically:

```js
import createQueue from '@startupjs/worker/createQueue'

// Create a queue instance for introspection (read-only usage)
const { queue } = createQueue({ name: process.env.QUEUE_NAME })

// Get job status
const job = await queue.getJob(jobId)
console.log('Job status:', await job.getState())

// Get job counts
const counts = await queue.getJobCounts()
console.log('Active jobs:', counts.active)
console.log('Waiting jobs:', counts.waiting)
console.log('Failed jobs:', counts.failed)
```

## Advanced Configuration

### Separate Process

Run worker in separate process:

```env
USE_SEPARATE_PROCESS=true
```

### Worker Threads

Use worker threads for better performance:

```env
USE_WORKER_THREADS=true
```

Note: Worker threads are applied only when `USE_SEPARATE_PROCESS=true`.

### Job Timeout

Set custom job timeout:

```env
JOB_TIMEOUT=60000
```

### Graceful Shutdown

The worker handles graceful shutdown automatically:

- Listens for `SIGTERM`, `SIGINT`, and `SIGQUIT` signals
- Waits for active jobs to complete (up to 60 seconds)
- Properly closes Redis connections
- Exits cleanly without data loss

```js
// Manual shutdown (if needed)
process.emit('SIGTERM')
```

### Job Cleanup

Jobs are automatically cleaned up after completion:

- Completed jobs are removed after 24 hours
- Failed jobs are removed after 24 hours
- This prevents Redis memory buildup

Cleanup age is fixed inside the worker (24h). To override it, instantiate your own Worker via `createWorker` and pass `removeOnComplete` / `removeOnFail` options.

## Troubleshooting

1. **Jobs not running**: Check Redis connection and `ENABLE_REDIS=true`
2. **Cron not working**: Verify cron pattern format
3. **Memory issues**: Consider `USE_SEPARATE_PROCESS=true`
4. **Job failures**: Check error logs and job data format
5. **Dashboard not accessible**: Verify dashboard route configuration
6. **Singleton jobs not working**: Ensure `uniqId` is provided
7. **Throttled jobs stuck**: Check for delayed jobs in Redis
8. **Worker threads issues**: Try `USE_WORKER_THREADS=false`
9. **Job timeouts**: Increase `JOB_TIMEOUT` or optimize job logic
10. **Redis connection errors**: Verify Redis server is running and accessible

## Examples

### Simple Scheduled Job

```js
// workerJobs/backup.js
export default async function backup() {
  console.log('Creating backup...')
  // Backup logic
}

export const cron = '0 1 * * *' // Daily at 1 AM
```

### Job with Data

```js
// workerJobs/notifyUsers.js
export default async function notifyUsers(jobData) {
  const { message, userIds } = jobData
  for (const userId of userIds) {
    console.log(`Notifying user ${userId}: ${message}`)
  }
}

export const cron = '*/10 * * * *' // Every 10 minutes
```

### Manual Job

```js
// workerJobs/generateReport.js
export default async function generateReport(jobData) {
  const { reportType, dateRange } = jobData
  console.log(`Generating ${reportType} report for ${dateRange}`)
  // Report generation logic
}

// No cron = manual execution only
```

### Singleton Job Example

```js
// workerJobs/processUser.js
export default async function processUser(jobData, { log }) {
  const { userId, action } = jobData
  log(`Processing user ${userId} with action ${action}`)

  // Your user processing logic here
  // This job will only run once per userId at a time
}

// Usage in your application
import addSingletonJob from '@startupjs/worker/addSingletonJob'

const { job, status } = await addSingletonJob('processUser', {
  uniqId: `user-${userId}`,
  userId: 123,
  action: 'update'
})
```
