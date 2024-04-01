# StartupJS Meta-package

This is a `startupjs` Meta-package which wraps all the main packages together
for easier distribution as a single package.

For the overall StartupJS readme refer to the root monorepo`s README.

## Extra dependencies

- `events` is added here as an explicit dependency since it's used inside `racer`.
  Which does not list it in its own dependencies. Usually on the browser it will be polyfilled by
  webpack, but in our case Metro does not polyfill it on it's own so we have to have it
  present in our dependencies somewhere.


## Hooks

### `beforeSession`

Use this hook to execute code before the session.

```js
  APP.on('beforeSession', expressApp => {
    expressApp.use((req, res, next) => {
      // some code
      next()
    })
  })
```

### `afterSession`

Use this hook to execute code after a session has been retrieved

```js
  APP.on('afterSession', expressApp => {
    expressApp.use((req, res, next) => {
      // some code
      next()
    })
  })
```

### `middleware`

Use this hook to add some code between the framework receiving a request, and the framework generating a response

```js
  APP.on('middleware', expressApp => {
    expressApp.use(yourFunction)
    expressApp.get('/your-path/', async (req, res, next) => {
      // some code
      next()
    })
  })
```

### `serverRoutes`

Use hook 'serverRoutes' to add routes on the backend side. Perhaps you know this one called 'routes'

```js
  APP.on('serverRoutes', expressApp => {
    expressApp.use('/test-api', testApi)
    expressApp.get('/test', async (req, res, next) => {
      // some code
      res.send('ok')
    })
  })
```

### `logs`

Hook on logs

```js
  APP.on('logs', expressApp => {
    expressApp.use((req, res, next) => {
      // some code
      next()
    })
  })
```

### `static`

Hook on static

```js
  APP.on('static', expressApp => {
      expressApp.use(express.static(options, paramsObject))
  })
```

### `api`

```js
  APP.on('api', expressApp => {
    console.log('[test] hook on api')
  })
```

### `createServer`

Get server without starting it

```js
  import { createServer } from 'startupjs/server'

  const { server, backend, session, channel, expressApp } = await createServer()

  // if you want to start it:
  server.listen(() => console.log('started'))
```
