import map from 'lodash/map.js'

const queryLockKey = 'tasks:lockQuery'
const env = process.env

export default class MongoQueue {
  constructor (dbs, dispatcherNum) {
    this.dispatcherNum = dispatcherNum
    this.backend = dbs.backend
    this.redlock = dbs.redlock
    this.redis = dbs.redis
  }

  async lock (key, ttl) {
    return await this.redlock.lock(key, ttl)
  }

  unlockQuery (lock) {
    lock.unlock(function (err) {
      if (err) console.log('Error while unlocking query lock', err)
    })
  }

  async doLoop () {
    const collection = env.WORKER_TASK_COLLECTION
    const start = Date.now()
    const model = this.backend.createModel()
    const queryLock = await this.lock(queryLockKey, env.WORKER_MONGO_QUERY_TIMEOUT)

    if (queryLock) {
      try {
        const $query = model.query(collection, this.getMongoQuery(start))
        await model.fetch($query)
        this.unlockQuery(queryLock)
        const tasks = map(($query.getExtra() || []), (item) => {
          const { task } = item
          task.num = item.num
          return task
        })
        await this.handleTasks(tasks)
      } catch (err) {
        this.unlockQuery(queryLock)
        console.log('Mongo error:', err)
        // Could not lock the resource
      }
    }

    model.close()
  }

  async handleTasks (tasks) {
    // serialize a list of task into redis
    // the list will be there only 1 second
    // after that it will expire
    const ttl = 1 // sec
    this.redis.setex('tasks:list', ttl, JSON.stringify(tasks))
  }

  getMongoQuery (now) {
    return {
      $aggregate: [
        {
          $match: {
            $or: [
              { status: 'new', startTime: { $exists: false } },
              { status: 'new', startTime: { $lt: now } },
              { status: 'executing', executingTime: { $lt: now - env.WORKER_TASK_DEFAULT_TIMEOUT } }
            ]
          }
        }, {
          $sort: { uniqId: 1, createdAt: 1 }
        }, {
          $group: {
            _id: '$uniqId',
            id: { $first: '$_id' },
            task: { $first: '$$ROOT' },
            num: { $sum: 1 }
          }
        }, {
          $sort: { 'task.createdAt': 1 }
        }, {
          $limit: Number(env.WORKER_MONGO_QUERY_LIMIT)
        }
      ]
    }
  }
}
