import { ROOT_MODULE as MODULE } from '@startupjs/registry'
import getBackend, {
  mongo,
  createMongoIndex,
  redisClient
} from '@startupjs/backend'
import initChannel from '@startupjs/channel/server'
import http from 'http'
import https from 'https'
import conf from 'nconf'
import { createSession } from './session.js'
import { createExpress } from './express.js'

let server = null

export { mongo, createMongoIndex }
export const redis = redisClient

export default async (options) => {
  options = Object.assign({ secure: true }, options)

  // Init backend and all apps
  const backend = await getBackend(options)

  // Init error handling route
  const error = options.error(options)

  // Init session
  const session = createSession(options)

  // Init connection
  const { wss, upgrade: sharedbWebSocket, middleware: sharedbBrowserChannel } = initChannel(backend, { session })
  MODULE.hook('createWss', wss)
  MODULE.on('afterSession', app => app.use(sharedbBrowserChannel))
  MODULE.on('serverUpgrade', function (req) {
    if (req.url === '/channel') sharedbWebSocket(...arguments)
  })

  const expressApp = createExpress({ backend, session, error, options })

  // Create server and setup websockets connection
  if (options.https) {
    server = https.createServer(options.https, expressApp)
  } else {
    server = http.createServer(expressApp)
  }
  MODULE.hook('createServer', server)

  if (conf.get('SERVER_REQUEST_TIMEOUT') != null) {
    server.timeout = ~~conf.get('SERVER_REQUEST_TIMEOUT')
  }

  server.on('upgrade', function () {
    MODULE.hook('serverUpgrade', ...arguments)
  })

  const props = { backend, server, expressApp, session }
  if (options.beforeStart) {
    // passing listenServer as callback to beforeStart is deprecated.
    // beforeStart should be an async function instead.
    // TODO: make it a breaking change and remove old api
    // TODO: deprecate passing backend as first argument, it should be in props
    await options.beforeStart(backend, Object.assign(() => {
      // deprecated. Should be just an object
      console.warn(WARN_DEPRECATED_BEFORE_START)
    }, props))
  }
  options.ee.emit('beforeStart', props)
  await MODULE.asyncHook('beforeStart', props)

  // Start server
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

// Handle graceful shutdown of the server
let shuttingDown = false
async function gracefulShutdown (exitCode = 0) {
  if (shuttingDown) return
  shuttingDown = true
  console.log('Exiting...')
  const promises = []
  if (server) promises.push(new Promise(resolve => server.close(resolve)))
  // delay exit by 3000 ms for extra safety in production.
  // In development this is also used as a force exit timeout
  setTimeout(() => process.exit(exitCode), 3000)
  // in development we exit as soon as the http server is closed
  if (process.env.NODE_ENV !== 'production') {
    await Promise.all(promises)
    console.log(`Closed everything. Exiting... (exit code: ${exitCode})`)
    process.exit(exitCode)
  }
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

process.on('SIGTERM', () => gracefulShutdown())
process.on('SIGINT', () => gracefulShutdown())
process.on('SIGQUIT', () => gracefulShutdown())

process.on('uncaughtException', (err) => {
  console.log('uncaught:', err, err.stack)
  gracefulShutdown(1)
})

const WARN_DEPRECATED_BEFORE_START = `
WARNING! DEPRECATED API USAGE! Please fix it now.
beforeStart: passing cb (listerServer) is deprecated and will be removed.
Instead of calling cb inside of beforeStart, just make beforeStart async function.
(just add \`async\` and remove calling the cb function completely, that's it)
`
