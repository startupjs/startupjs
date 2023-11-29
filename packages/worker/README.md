# @startupjs/worker
> Worker to perform specified actions

## Usage

1. In project root create `worker.js`:

  ```js
  import 'startupjs/nconf'
  import { TaskDispatcher } from '@startupjs/worker'
  import path from 'path'

  // full path to workerActions.js and workerInit.js
  process.env.WORKER_ACTIONS_PATH = path.join(process.cwd(), './workerActions.js')
  process.env.WORKER_INIT_PATH = path.join(process.cwd(), './workerInit.js')

  const dispatcher = new TaskDispatcher()

  dispatcher.start().catch((err) => {
    console.log('Error starting worker', err)
  })
  ```

1. In project root create `workerInit.js`. Do any initializations here (plug in hooks, ORM, etc.):

    ```js
    import init from 'startupjs/init'
    import orm from './model'
    import shareDbHooks from 'sharedb-hooks'
    import hooks from './server/hooks'

    export let workerInit = global.DM_WORKER_INIT = function (backend) {
      // do initializations here
      init({ orm })
      shareDbHooks(backend)
      hooks(backend)
    }
    ```

1. In project root create `workerActions.js`. Put your tasks here (name of functions are the name of tasks).:

    ```js
    let ACTIONS = global.DM_WORKER_ACTIONS = {}

    ACTIONS.test = (model, task, done) => {
      console.log('>> Start test task', task.id)
      setTimeout(() => {
        console.log('>> Finish test task', task.id)
        done()
      }, 5000)
    }
    ```

1. Run in console:

```js
node worker.js
```

# Defaults

Worker has default parameters. These values ​​can be changed if necessary in `worker.js` by specifying them in `process.env`.

```js
WORKER_CHILDREN_NUM: '2' // workers amount
WORKER_TASK_DEFAULT_TIMEOUT: '30000' // time on execute task
WORKER_THROTTLE_TIMEOUT: '3000' // time on execute task for throttle option
WORKER_TASK_COLLECTION: 'tasks' // task collection name
WORKER_MONGO_QUERY_TIMEOUT: '600' // mongo lock time
WORKER_MONGO_QUERY_INTERVAL: '200' // timeout for Mongo query
WORKER_MONGO_QUERY_LIMIT: '100' // number of tasks in one Mongo query
WORKER_REDIS_QUEUE_INTERVAL: '100' // timeout for Redis requests
MONGO_URL: 'mongodb://localhost:27017/tasks'
REDIS_URL: 'redis://localhost:6379/0'
```

## MIT License

Copyright (c) 2020 Decision Mapper
