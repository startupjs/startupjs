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

Use this hook if you need to create and configure API routes.

```js
  api: (expressApp) => {
    // Creating a route to handle GET requests
    expressApp.get('/api/data', async (req, res) => {
      // Handling GET request
      res.json({ message: 'Data received from the server' })
    })

    // Creating a route to handle POST requests
    expressApp.post('/api/data', async (req, res) => {
      // Handling POST request and saving data
      const requestData = req.body
      res.json({ message: 'Data received and processed successfully' })
    })
  }
```

### `beforeSession`

Use this hook to execute code before initializing session data.

```jsx
  beforeSession: (expressApp) => {
    // Example of adding middleware before session initialization
    expressApp.use('/api/validate', (req, res, next) => {
      // Example of session validation before initialization
      if (!req.headers['authorization']) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      // If the session is valid, continue with the request execution
      next()
    })
  }
```

### `afterSession`

Use this hook to execute code after initializing session data.

```js
  afterSession: (expressApp) => {
    // Example of adding middleware after session initialization
    expressApp.use('/api/log', (req, res, next) => {
      // Example of logging request information after session initialization
      console.log(`Request to ${req.originalUrl} from ${req.ip}`)
      next()
    })
  }
```

### `middleware`

Use this hook to add some code between the framework receiving a request, and the framework generating a response.

```js
  middleware: (expressApp) => {
    // Example of adding middleware for logging each request
    expressApp.use((req, res, next) => {
      console.log(`Received ${req.method} request at ${req.url}`)
      next() // Passing control to the next middleware
    })

    // Example of adding middleware for error handling
    expressApp.use((err, req, res, next) => {
      console.error('An error occurred:', err)
      res.status(500).send('Internal Server Error')
    })
  }
```

### `serverRoutes`

Use this hook to configure routes and handlers for those routes on the backend side. Perhaps you know this one called 'routes'.

```js
  serverRoutes: (expressApp) => {
    // Creating a route to handle GET requests
    expressApp.get('/api/data', async (req, res) => {
      // Here could be the logic for handling the request
      res.json({ message: 'Data received from the server' })
    })

    // Creating a route to handle POST requests
    expressApp.post('/api/data', async (req, res) => {
      // Here could be the logic for handling the request and saving data
      const requestData = req.body
      res.json({ message: 'Data received and processed successfully' })
    })
  }
```

### `logs`

Use this hook if you need to create a logging system.

```js
  logs: (expressApp) => {
    // Creating a route for logging information
    expressApp.get('/logs', async (req, res) => {
      // Here you can add logic for fetching and displaying logs.
      res.send('Log information will be displayed here')
    })

    // Creating a route for logging records
    expressApp.post('/logs', async (req, res) => {
      const logData = req.body
      // Here you can add logic for saving logs
      console.log('Received log data:', logData)
      res.send('Log data received and saved successfully')
    })
  }
```

### `static`

Use this hook to add standard static server behavior to expressApp.

```js
  static: (expressApp) => {
    // Example of adding standard behavior of a static server
    expressApp.use('/public', express.static('public'))
  }
```

### `createServer`

Use this hook if you need to configure and start the server.

**Note:** You should pass the arguments and receive them as arguments in the server field of createPlugin.

```js
  createServer: (expressApp) => {
    const http = require('http')

    // Creating an HTTP server using Express application
    const server = http.createServer(expressApp)

    // Setting up the port to listen on
    const PORT = process.env.PORT || 3000

    // Starting the server on the specified port
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  }
```

### `serverUpgrade`

Use this hook if you need to update and configure the server.

**Note:** You should pass the arguments and receive them as arguments in the server field of createPlugin.

```js
  serverUpgrade: (expressApp) => {
    const http = require('http')

    // Creating an HTTP server using Express application
    const server = http.createServer(expressApp)

    // Setting up the port to listen on
    const PORT = process.env.PORT || 3000

    // Starting the server on the specified port
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  }
```

### `beforeStart`

Use this hook to execute code before starting the Express server.

**Note:** You should pass props and receive it as an argument in the server field of createPlugin.

```js
  beforeStart: (expressApp) => {
    // Setting up the database connection before starting the server
    const db = require('./db')
    db.connect()

    // Example of adding middleware before starting the server
    expressApp.use((req, res, next) => {
      // Example of logic executed before handling requests
      console.log('Incoming request:', req.url)
      next()
    })

    console.log('Server is about to start...')
  }
```

### `orm`

Use this hook for integrating ORM into this Express.js application.

**Note:** You should pass the Racer and receive it as an argument in the server field of createPlugin.

```js
  orm: (expressApp) => {
    // You can obtain Racer as an argument from options
    // const { Racer } = require('@startupjs/orm')
    // const racer = new Racer()

    // Setting up ORM for database interaction before usage
    racer.set('db', options.db)

    // Example of adding middleware for working with ORM
    expressApp.use((req, res, next) => {
      req.model = racer.createModel()
      next()
    })
  }
```

### `transformSchema`

Use this hook to transform schema.

**Note:** You should pass the schema and receive it as an argument in the server field of createPlugin.

```js
  transformSchema: (expressApp) => {
    const { Schema } = require('@startupjs/orm')

    // Obtaining the basic data schema
    const baseSchema = options.baseSchema

    // Transforming the data schema
    const transformedSchema = new Schema({
      ...baseSchema,
      // Adding new fields or modifying existing ones
      additionalField: {
        type: String,
        default: 'defaultValue'
      }
    })

    // Using the transformed schema in the application
    options.orm.setSchema(transformedSchema)
  }
```

## Example

Suppose you have a button in your client code, clicking on which the application should fetch data from the server.

```js
import { useState } from 'react'
import { axios, observer } from 'startupjs'
import { Div, Button, Span } from '@startupjs/ui'

export default observer(function SomeScreen () {
  const [text, setText] = useState('')

  async function fetchData () {
    const response = await axios.get('/api/get-data')
    setText(response.data)
  }

  return (
    <Div>
      <Button pushed onPress={fetchData}>Fetch by plugin</Button>
      {text ? <Span>Text: {text}</Span> : undefined}
    </Div>
  )
})
```

Create a plugin file named plugin.js or myTestPlugin.plugin.js.
In this example, we will use the "api" hook, which will return some data from the server.

```js
import { createPlugin } from '@startupjs/registry'

export default createPlugin({
  name: 'test',
  enabled: true,
  server: ({ options }) => ({
    api (expressApp) {
      expressApp.get('/api/get-data', async (req, res) => {
        res.json({ message: 'The text returned by the plugin' })
      })
    }
  })
})
```

Add this file to exports of package.json under the plugin or test.plugin name to load it automatically into your app:
```js
  "exports": {
    "./plugins/test.plugin": "./plugins/test.plugin.js"
  }
```
