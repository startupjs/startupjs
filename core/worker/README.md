# @startupjs/worker

Worker system based on BullMQ for background job processing with cron scheduling.

## Features

- **Cron Scheduling**: Schedule jobs using cron patterns
- **Background Processing**: Process jobs in background with configurable concurrency
- **Plugin Integration**: Plugins can add and modify jobs through hooks
- **File-based Jobs**: Define jobs in `workerJobs/` folder
- **Redis Integration**: Uses Redis for job queue management

## Installation

```bash
yarn add @startupjs/worker bullmq redis
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
        queueName: 'my-app-queue',
        concurrency: 300,
        autoStart: true
      }
    }
  }
}
```

## Environment Variables

Create `.env` file:

```env
REDIS_URL=redis://localhost:6379
ENABLE_REDIS=true
QUEUE_NAME=your-app-queue
CONCURRENCY=300
JOB_TIMEOUT=30000
USE_SEPARATE_PROCESS=false
USE_WORKER_THREADS=true
AUTO_START=true
```

## Adding Jobs

### Method 1: File-based Jobs (Recommended)

Create files in `workerJobs/` folder. Each file should export:

- `default`: The job handler function
- `cron`: Cron pattern for scheduling (optional)

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

export const cron = '0 */6 * * *' // Every 6 hours
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

### Method 2: Manual Job Execution

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
          cron: '0 */6 * * *' // Every 6 hours
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
      cron: '0 3 * * *' // Override the cron schedule
    }
  }
}
```

## Job Data

Jobs receive data in the following format:

```js
{
  type: 'jobName',
  description: 'Job description',
  retryCount: 3,
  timeout: 30000,
  // ... custom jobData
}
```

## Error Handling

Jobs that fail will be retried based on the retry configuration. Check logs for error details:

```
[@startupjs/worker] Error in job 'cleanup': Error message here
```

## Monitoring

The worker provides detailed logging:

```
[@startupjs/worker] Registered job 'cleanup' with schedule '0 2 * * *'
[@startupjs/worker] Collected jobs from plugins: ['online-status-tick']
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

### Job Timeout

Set custom job timeout:

```env
JOB_TIMEOUT=60000
```

## Troubleshooting

1. **Jobs not running**: Check Redis connection and `ENABLE_REDIS=true`
2. **Cron not working**: Verify cron pattern format
3. **Memory issues**: Consider `USE_SEPARATE_PROCESS=true`
4. **Job failures**: Check error logs and job data format

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
