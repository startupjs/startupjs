const defaults = {
  WORKER_CHILDREN_NUM: '2',
  WORKER_TASK_DEFAULT_TIMEOUT: '30000',
  WORKER_THROTTLE_TIMEOUT: '3000',
  WORKER_TASK_COLLECTION: 'tasks',
  WORKER_MONGO_QUERY_TIMEOUT: '600',
  WORKER_MONGO_QUERY_INTERVAL: '200',
  WORKER_MONGO_QUERY_LIMIT: '100',
  WORKER_REDIS_QUEUE_INTERVAL: '100'
}

for (const key in defaults) {
  process.env[key] = process.env[key] || defaults[key]
}
