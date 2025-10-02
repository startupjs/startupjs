# Hooks

## Client-side hooks

### `renderRoot`

This hook is used to define the root component in which all child components of the application will be rendered. The renderRoot hook allows you to change the standard rendering behavior and its structure.

If you have multiple plugins, each of which calls renderRoot, then each subsequent plugin will receive in children what
is returned after the previous plugin's work. This ensures "nesting".

Let's examine this hook in more detail with an example. Suppose we have two plugins. The first plugin will add a red bar with the text "Red block" to our application. It looks like this:

```js
export default createPlugin({
  name: 'redPlugin',
  client: () => ({
    renderRoot ({ children }) {
      return <>
        <RedBlock />
        {children}
      </>
    }
  })
})

const RedBlock = observer(({ children }) => {
  return pug`
    Div.root(row)
      Span Red block
  `
  styl`
    .root
      background-color var(--color-bg-error)
      width: '100%'
  `
})
```

Next, we'll connect the second plugin:

```js
export default createPlugin({
  name: 'greenPlugin',
  client: () => ({
    renderRoot ({ children }) {
      return <>
        <GreenBlock />
        {children}
      </>
    }
  })
})

const GreenBlock = observer(({ children }) => {
  return pug`
    Div.root(row)
      Span Green block
  `
  styl`
    .root
      background-color var(--color-bg-success)
      width: '100%'
  `
})
```

It will add a green bar with the text "Green block". At the same time, we will still see the red bar on the screen too.


### `customFormInputs`

Using the 'customFormInputs' hook, you can add new types of Input component, which, in turn, is part of the Form component logic.

You can read more about Form here:
https://github.com/startupjs/startupjs/blob/master/packages/ui/components/forms/Form/Form.en.mdx


```js
  export default createPlugin({
    name: 'userCustomForm',
    client: ({ minAge }) => ({
      customFormInputs: () => ({
        age: observer(({ $value }) => {
          function setAge (age) {
            if (age < minAge) age = minAge
            $value.set(age)
          }
          return <NumberInput value={$value.get()} onChangeNumber={setAge} />
        })
      })
    })
  })
```

## Server-side hooks

### `api`

The 'api' hook defines API routes for handling server requests.

```js
  api: (expressApp) => {
    // Creating a route for handling GET requests
    expressApp.get('/api/data', async (req, res) => {
      // Handling GET request
      res.json({ message: 'Data received from server' })
    })
  }
```

### `beforeSession`

The 'beforeSession' hook is called before session initialization on the server. It provides the ability to perform any operations or set configurations before the server starts processing requests. Sessions on the server are implemented using the express-session package, more details about its capabilities can be read on the [official page](https://github.com/expressjs/session#readme).

```jsx
  beforeSession: (expressApp) => {
    // Example of adding middleware before session initialization
    expressApp.use('/api', (req, res, next) => {
      // Example of session check before initialization
      if (!req.headers['authorization']) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      // If everything is ok, continue request execution
      next()
    })
  }
```

### `afterSession`

The 'afterSession' hook is called after session initialization on the server.

```js
  afterSession: (expressApp) => {
    // Example of adding middleware after session initialization
    expressApp.use('/api', (req, res, next) => {
      // Output request information
      console.log(`Request path: ${req.url}`);
      next()
    })
  }
```

### `middleware`

The 'middleware' hook defines a middleware handler. This hook can be used to add common operations or checks.

```js
  middleware: (expressApp) => {
    // Example of adding middleware
    expressApp.use('/api', (req, res, next) => {
      const lang = req.session.lang
      if (lang) req.model.set('_session.lang', lang)
      next()
    })
  }
```

### `serverRoutes`

The 'serverRoutes' hook is used to add server endpoints that can be used both for HTML rendering and for implementing webhooks and similar functionality.

```js
  serverRoutes: (expressApp) => {
    // Creating a route for handling GET requests
    expressApp.get('/promo-page', (req, res) => {
      // Sending HTML as response to request
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Promo Page</title>
          </head>
          <body>
            <!-- some code -->
          </body>
        </html>
      `)
    })
  }
```


## Isomorphic hooks

In isomorphic hooks, you can place code that will execute both on the server and on the client.

### `models`

The 'models' hook receives models (projectModels) that have been added to the project. Using this hook, you can modify models or add new ones.

Here we'll show how to add a hook in general, and more detailed usage examples can be found [here](https://github.com/startupjs/startupjs/blob/master/docs/general/en/models.en.md)

```js
  export default createPlugins({
    name: 'addPersonModel',
    // Don't forget that models is an isomorphic hook
    isomorphic: () => ({
      // Hook receives project models (projectModels)
      models: (projectModels) => {
        return {
          ...projectModels,
          // below for each collection or document, you need to specify an object with the same fields
          // that are usually exported from the model file.
          // Let's add a persons collection model
          persons: {
            // in default, specify the ORM class with custom method implementations for this collection model
            default: PersonsModel,
            // for schema, pass schema
            schema
            // ... other data, for example, indexes or constants,
            // that were exported from the model file
          }
        }
      }
    })
  })
```

### `orm`

The 'orm' hook is an advanced hook for overriding Racer, which is used under the hood for ORM implementation. In particular, it can be used if you need to connect plugins for racer (via racer.use()) or extend racer's standard functionality. A Racer instance is passed as an argument to this hook.

You can learn more about Racer in the documentation at https://github.com/derbyjs/racer

```js
// import plugin
import racerPlugin from './myRacerPlugin.js';
```

```js
  orm: (racer) => {
    // Connect racer plugin
    racer.use(racerPlugin);
  }
```


## Plugin creation example

Suppose we have a button in client code that, when clicked, should get data from the server.
All the client file code will be like this:

```js
import { useState } from 'react'
import { observer } from 'startupjs'
import { Div, Button, Span } from '@startupjs/ui'
import axios from 'axios'

export default observer(function SomeScreen () {
  const [data, setData] = useState()

  async function fetchData () {
    try {
      const response = await axios.get('/api/get-data')
      setData(response.data)
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <Div>
      <Button onPress={fetchData}>Fetch by plugin</Button>
      {data && data.message && <Span>Text: {data.message}</Span>}
    </Div>
  )
})
```

Let's create a plugin file named test.plugin.js.
In this example, we'll use the "api" hook, which will return some data from the server.

```js
import { createPlugin } from '@startupjs/registry'

export default createPlugin({
  name: 'test',
  enabled: true,
  // runtime environment - server
  // we receive pluginOptions, to which we passed appName (described below)
  server: (pluginOptions) => ({
    // use api hook
    api: (expressApp) => {
      // on GET request to '/api/get-data'
      // return our text, to which we add custom appName from pluginOptions
      expressApp.get('/api/get-data', async (req, res) => {
        res.json({ message: `Text returned by plugin ${pluginOptions.appName}` })
      })
    }
  })
})
```

Let's add plugin information to startupjs.config.js and pass the necessary parameters to it (they will be in pluginOptions)

```js
  import testPlugin from './test.plugin.js'

  export default {
    plugins: {
      [testPlugin]: {
        // pass custom pluginOptions for hooks
        server: {
          // let this be some application name that will be in appName
          // we'll get this data in the plugin itself and can use it at our discretion
          appName: 'TEST APP'
        }
      }
    }
  }
```

Add this file to "exports" in package.json so it automatically loads into your application:

```json
  "exports": {
    "./test.plugin": "./test.plugin.js"
  }
```

## Read more:
- [What are modules and how to work with them](https://github.com/startupjs/startupjs/blob/master/docs/general/en/about-modules.en.md)