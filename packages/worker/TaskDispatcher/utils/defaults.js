
import path from 'path'

const defaults = {
  WORKER_CHILDREN_NUM: '2',
  WORKER_TASK_DEFAULT_TIMEOUT: '30000',
  WORKER_THROTTLE_TIMEOUT: '3000',
  WORKER_TASK_COLLECTION: 'tasks',
  WORKER_MONGO_QUERY_TIMEOUT: '600',
  WORKER_MONGO_QUERY_INTERVAL: '200',
  WORKER_MONGO_QUERY_LIMIT: '100',
  WORKER_REDIS_QUEUE_INTERVAL: '100',
  MONGO_URL: 'mongodb://localhost:27017/tasks',
  REDIS_URL: 'redis://localhost:6379/0',
  WORKER_ACTIONS_PATH: path.join(process.cwd(), './workerActions.mjs'),
  WORKER_INIT_PATH: path.join(process.cwd(), './initWorker.mjs')
}

for (let key in defaults) {
  process.env[key] = process.env[key] || defaults[key]
}
