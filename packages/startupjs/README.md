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
  // Unique plugin name
  name: 'my-plugin',
  // The key indicates whether the plugin is enabled or not.
  // If its value is false, then the plugin is considered disabled, and its
  // functionality will not be activated in the application.
  enabled: true,
  client: (pluginOptions) => ({
    // Сlient hooks implementation
  }),
  isomorphic: (pluginOptions) => ({
    // Isomorphic hooks implementation
  }),
  server: (pluginOptions) => ({
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
  "./plugin": "./plugin.js"
}
```

To pass options (pluginOptions in the example) to the plugin, you need to specify them in the startupjs.config.js file.

```js
  export default {
    plugins: {
      // List of plugins
      [plugins.firstPlugin]: {
        client: {
          // List of options for client-side hooks. They will be available in pluginOptions.
          message: 'Startupjs app',
          defaultVisible: false
        }
      },
      [plugins.secondPlagin]: {
        client: {
          // List of options for client-side hooks. They will be available in pluginOptions.
          message: 'Startupjs app',
        },
        server: {
          // List of options for server-side hooks. They will be available in pluginOptions.
          key: 'someKey'
        }
      },
      // Here you can add your plugin to the list with the necessary options.
    }
  }
```

## Hooks / client

### `renderRoot`

The hook is used to define the root component into which all child components of the application will be rendered.

```js
  renderRoot ({ children }) {
    return <>
      <SomeComponent />
      {children}
    </>
  }
```

### `customFormInputs`

The hook allows registering custom components for use instead of standard HTML input elements such as input, textarea, and select.

```js
  customFormInputs: () => {
    // Key - the name of the field to be used in the form
    // Value - the component to be used for rendering this field
    myCustomInput: MyCustomInputComponent,
    anotherCustomInput: AnotherCustomInputComponent,
    // and so on...
  }
```

Next, in any form in your application, you can use the registered custom components as regular input elements.

```js
  <Form>
    <myCustomInput name="customInput1" />
    <anotherCustomInput name="customInput2" />
    {/* and so on... */}
  </Form>
```

## Hooks / isomorphic

In isomorphic hooks, you can place code that will be executed both on the server and the client.

### `orm`

The 'orm' hook is used to configure Object-Relational Mapping (ORM) in an Express.js application.

**Note:** You should pass the Racer and receive it as an argument.

```js
  orm: (Racer) => {
    const racer = new Racer();
    // Setting up ORM on the server
  }
```

## Hooks / server

### `api`

The 'api' hook defines API routes for handling requests to the server

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

The 'beforeSession' hook is called before the session starts on the server. It provides an opportunity to perform any operations or set configurations before the server begins handling requests.

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

The 'afterSession' hook adds middleware to handle requests to the route after the session ends on the server.

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

The 'middleware' hook defines a middleware handler. This hook can be used to add common operations or checks.

```js
  middleware: (expressApp) => {
    // Example of adding middleware for logging each request
    expressApp.use('/api', (req, res, next) => {
      console.log(`Received ${req.method} request at ${req.url}`)
      next() // Passing control to the next middleware
    })
  }
```

### `serverRoutes`

The hook is intended to define route handlers on the server.

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

The 'logs' hook handles requests for retrieving and saving logs.

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

The hook allows access to static files (such as images, CSS, JavaScript) on the client-side of your application, making them accessible via a specific URL.

```js
  static: (expressApp) => {
    expressApp.use('/public', express.static('public'))
  }
```

### `createServer`

Use this hook if you need to configure and start the server.

**Note:** You should pass the server and receive it as arguments.

```js
  createServer: (server) => {
    // Setting up the port to listen on
    const PORT = process.env.PORT || 3000

    // Starting the server on the specified port
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  }
```

### `serverUpgrade`

The hook allows defining logic for handling connection upgrades at the HTTP server level, which enables efficient handling of connections using the WebSocket protocol and other protocols requiring connection upgrades.

**Note:** You should pass the arguments and receive them as an argument.

```js
  serverUpgrade: (...arguments) => {
    // In this handler, you can define logic for handling connection upgrades.
    // For example, you can check authorization or establish a new WebSocket connection.
  }
```

### `beforeStart`

Use this hook to execute code before starting the Express server.

**Note:** You should pass props and receive them as an argument.

```js
  beforeStart: (props) => {
    // For example, setting up the database connection before starting the server
    const db = require('./db')
    db.connect()
    console.log('Server is about to start...')
  }
```

### `transformSchema`

Use this hook to transform schema.

**Note:** You should pass the schema and receive it as an argument.

```js
  transformSchema: (schema) => {
    // Modifying the schema, for example, adding new fields or removing existing ones
    // Example of adding a new field
    schema.properties.newField = { type: 'string' };
    // Example of removing a field
    delete schema.properties.unwantedField;
    return schema;
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
  // If needed, you can obtain pluginOptions here, but they are not required in our example.
  // server: (pluginOptions) => ({
  server: () => ({
    api (expressApp) {
      expressApp.get('/api/get-data', async (req, res) => {
        res.json({ message: 'The text returned by the plugin' })
      })
    }
  })
})
```

Add this file to exports of package.json under the plugin or test.plugin name to load it automatically into your app:

```json
  "exports": {
    "./plugins/test.plugin": "./plugins/test.plugin.js"
  }
```
