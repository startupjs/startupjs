const createBackend = require('@startupjs/backend')
const http = require('http')
const https = require('https')
const conf = require('nconf')
let server = null
let wsServer = null

module.exports = async (options) => {
  options = Object.assign({ secure: true }, options)
  // React apps routes
  const appRoutes = options.appRoutes

  // Init backend and all apps
  const { backend, shareDbMongo } = await createBackend(options)

  // Init error handling route
  const error = options.error(options)

  require('./express')(
    backend,
    shareDbMongo._mongoClient,
    appRoutes,
    error,
    options,
    ({ expressApp, upgrade, wss }) => {
      wsServer = wss

      // Create server and setup websockets connection
      if (options.https) {
        server = https.createServer(options.https, expressApp)
      } else {
        server = http.createServer(expressApp)
      }
      if (conf.get('SERVER_REQUEST_TIMEOUT') != null) {
        server.timeout = ~~conf.get('SERVER_REQUEST_TIMEOUT')
      }

      if (options.websockets) server.on('upgrade', upgrade)

      const listenServer = () => {
        server.listen(conf.get('PORT'), (err) => {
          if (err) {
            console.error('Server failed to start. Exiting...')
            return process.exit()
          }
          printStarted()
          // ----------------------------------------------->       done       <#
          options.ee.emit('done')
        })
      }

      // Start Server
      if (options.beforeStart != null) {
        options.beforeStart(backend, listenServer)
      } else {
        listenServer()
      }
    })
}

// Handle graceful shutdown of the server

function gracefulShutdown (code) {
  console.log('Exiting...')
  if (server) {
    console.log('Http server closing...')
    server.close(() => {
      console.log('Http server closed')
    })
  }
  if (wsServer && wsServer._server) {
    console.log('Ws server closing...')
    wsServer._server.close(() => {
      console.log('Ws server closed')
    })
  }
  setTimeout(() => {
    process.exit(code)
  }, 3000)
}

function printStarted () {
  const port = conf.get('PORT')
  // Support for the `dev` shell script which runs startupjs app inside a Docker container
  const dockerHostPort = conf.get('DOCKER_HOST_PORT')
  if (dockerHostPort) {
    console.log('Server started. Running inside Docker.')
    console.log(
      `Go to: http://localhost:${dockerHostPort} on your host machine ` +
      `(inside docker it's on port ${port})`
    )
  } else {
    console.log('Server started.')
    console.log(`Go to: http://localhost:${port}`)
  }
}

process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)
process.on('SIGQUIT', gracefulShutdown)

process.on('uncaughtException', (err) => {
  console.log('uncaught:', err, err.stack)
  gracefulShutdown(100)
})
