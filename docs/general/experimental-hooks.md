# Experimental Hooks

## Hooks: server

### `logs`

The 'logs' hook handles requests for getting and saving logs.

```js
  logs: (expressApp) => {
    expressApp.use('/api', (req, res, next) => {
      // Example of logging request information
      console.log(`Request to ${req.originalUrl} from ${req.ip}`)
      next()
    })
  }
```

### `static`

This hook is designed to declare additional static files (such as images, CSS, JavaScript) on the client side of your application, making them available through a specific URL. You can still access the public folder, which will be available at url '/'.

```js
  static: (expressApp) => {
    expressApp.use('/assets', expressApp.static('assets'))
  }
```

### `createServer`

Use the 'createServer' hook if you need to configure and start the server. The hook receives a 'server' argument, which is an instance of Node HTTP Server. You can read more in the official documentation at the link
https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener

```js
  createServer: (server) => {
    // Configure port for listening
    const PORT = process.env.PORT || 3000

    // Start server on specified port
    server.listen(PORT, () => {
      console.log(`Server started. Port: ${PORT}`)
    })
  }
```

### `serverUpgrade`

This hook is designed to handle upgrading HTTP connection to WebSocket connection. This hook receives
req, socket, head as arguments (args). You can learn more about the upgrade event from the official documentation at the link https://nodejs.org/api/http.html#event-upgrade

```js
  serverUpgrade: (...args) => {
    socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n');

    socket.pipe(socket);
  }
```

### `beforeStart`

Use the 'beforeStart' hook to execute code before starting the Express server. This hook receives props as arguments, which include backend, server, expressApp, session.

```js
  beforeStart: (props) => {
    // For example, setting up database connection before starting server
    const db = require('./db')
    db.connect()
    console.log('Server ready to start...')
  }
```

### `transformSchema`

Use the 'transformSchema' hook to modify the schema. This hook receives schema as an argument.

```js
  transformSchema: (schema) => {
    // Modify schema, for example, adding new fields or removing existing ones
    // In this example we add a new field
    schema.properties.newField = { type: 'string' };
    // In this example we remove a field
    delete schema.properties.unwantedField;
    return schema;
  }