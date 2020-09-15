# @startupjs/worker
> Worker

## Usage

1. In project root create folder `worker` and create `index.mjs`:

  ```js
    import { TaskDispatcher }  from '@startupjs/worker'
    import path from 'path'

    // full path to workerActions.mjs and workerInit.mjs
    // by default 'worker/workerActions.mjs'
    process.env.WORKER_ACTIONS_PATH = path.join(process.cwd(), './workerActions.mjs') 
    // by default worker/initWorker.mjs
    process.env.WORKER_INIT_PATH = path.join(process.cwd(), './workerInit.mjs') 
        
    const dispatcher = new TaskDispatcher()

    dispatcher.start().catch((err) => {
      console.log('Error starting worker', err)
    })
  ```
  *Note: There is need to create init and action file with extention `.mjs`. This is necessary for node to treat these files as `modules`.

2. In folder `worker` create `workerInit.mjs`. Do any initializations here (plug in hooks, ORM, etc.):

  ```js
    export let init = global.DM_WORKER_INIT = function (backend) {
      // do initializations here
    }
  ```

3. In folder `worker` create `workerActions.mjs`. Put your tasks here (name of functions are the type of tasks):

  ```js
    export let ACTIONS = {
      test: (model, task, done) {
        console.log('>> Start test task', task.id)
        setTimeout(() => {
          console.log('>> Finish test task', task.id)
          done()
        }, 5000)
      }
    }
  ```

4. Run in console:

  ```js
    cd worker && node index.mjs
  ```

# Defaults

  Worker has default parameters. These values ​​can be changed if necessary in `index.mjs`.

  ```js
    WORKER_CHILDREN_NUM: '2', // workers amount in TaskDispatcher 
    WORKER_TASK_DEFAULT_TIMEOUT: '30000', // time on execute task
    WORKER_THROTTLE_TIMEOUT: '3000', // time on execute task
    WORKER_TASK_COLLECTION: 'tasks', // task collection name
    WORKER_MONGO_QUERY_TIMEOUT: '600', // mongo lock time
    WORKER_MONGO_QUERY_INTERVAL: '200', // timeout for Mongo requests
    WORKER_MONGO_QUERY_LIMIT: '100', // number of tasks in one request
    WORKER_REDIS_QUEUE_INTERVAL: '100', // timeout for Redis requests
    MONGO_URL: 'mongodb://localhost:27017/tasks',
    REDIS_URL: 'redis://localhost:6379/0',
    WORKER_ACTIONS_PATH: path.join(process.cwd(), './workerActions.mjs'),
    WORKER_INIT_PATH: path.join(process.cwd(), './initWorker.mjs')
  ```

## MIT Licence

Copyright (c) 2020 Decision Mapper
