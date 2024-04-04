# StartupJS Meta-package

This is a `startupjs` Meta-package which wraps all the main packages together
for easier distribution as a single package.

For the overall StartupJS readme refer to the root monorepo`s README.

## Extra dependencies

- `events` is added here as an explicit dependency since it's used inside `racer`.
  Which does not list it in its own dependencies. Usually on the browser it will be polyfilled by
  webpack, but in our case Metro does not polyfill it on it's own so we have to have it
  present in our dependencies somewhere.

## Plugins API

Create a plugin file named `plugin.js` or `myPlugin.plugin.js`:

```js
import { createPlugin } from 'startupjs/registry'

export default createPlugin({
  name: 'my-plugin',
  client: (pluginOptions) => ({
    // client hooks implementation
  }),
  server: (options) => ({
    // Here you can add server-side hooks. For example:
    beforeSession: (expressApp) => {
      expressApp.use('/your-uniq-path', yourFunction)
    },
    api: (expressApp) => {
      expressApp.get('/api/your-uniq-path', async (req, res) => {})
      expressApp.post('/api/your-uniq-path', async (req, res) => {})
    }
  })
})
```

Add this file to `exports` of `package.json` under the `plugin` or `myPlugin.plugin` name to load it automatically into your app:

```json
"exports": {
  "plugin": "./plugin.js"
}
```

## Hooks / server

### `api`

```js
  api: (expressApp) => {
    expressApp.use('/api/your-uniq-path', yourFunction)
    expressApp.get('/api/your-uniq-path', async (req, res) => {
      // some code
    })
  }
```

### `beforeSession`

Use this hook to execute code before initializing session data.

```jsx
  beforeSession: (expressApp) => {
    expressApp.use('/your-uniq-path', yourFunction)
    expressApp.get('/your-uniq-path', (req, res) => {
      // some code
    })
  }
```

### `afterSession`

Use this hook to execute code after initializing session data.

```js
  afterSession: (expressApp) => {
    expressApp.use('/your-uniq-path', yourFunction)
    expressApp.get('/your-uniq-path', (req, res) => {
      // some code
    })
  }
```

### `middleware`

Use this hook to add some code between the framework receiving a request, and the framework generating a response

```js
  middleware: (expressApp) => {
    expressApp.use('/your-uniq-path', yourFunction)
    expressApp.get('/your-uniq-path', async (req, res, next) => {
      // some code
    })
  }
```

### `serverRoutes`

Use this hook to configure routes and handlers for those routes on the backend side. Perhaps you know this one called 'routes'

```js
  serverRoutes: (expressApp) => {
    expressApp.use('/your-uniq-path', yourFunction)
    expressApp.get('/your-uniq-path', async (req, res, next) => {
      // some code
    })
  }
```

### `logs`

Hook creates a logging system

```js
  logs: (expressApp) => {
    expressApp.use('/your-uniq-path', yourFunction)
    expressApp.get('/your-uniq-path', (req, res) => {
      // some code
    })
  }
```

### `static`

Use this hook to add standard static server behavior to expressApp

```js
  static: (expressApp) => {
    expressApp.use(yourFunction)
  }
```

### `createServer`

Get server without starting it.

**Note:** You should pass the arguments and receive it as an argument in the server field of createPlugin

```js
  createServer: (expressApp) => {
    // some code
  }
```

### `serverUpgrade`

**Note:** You should pass arguments and receive it as an argument in the server field of createPlugin

```js
  serverUpgrade: (expressApp) => {
    // some code
  }
```

### `beforeStart`

Use this hook to execute code before starting the Express server

**Note:** You should pass props and receive it as an argument in the server field of createPlugin

```js
  beforeStart: (expressApp) => {
    // some code
  }
```

### `orm`

Use this hook for integration orm this express.js application

**Note:** You should pass the Racer and receive it as an argument in the server field of createPlugin

```js
  orm: (expressApp) => {
    // some code
  }
```

### `transformSchema`

Use this hook to transform schema

**Note:** You should pass the schema and receive it as an argument in the server field of createPlugin

```js
  transformSchema: (expressApp) => {
    // some code
  }
```
