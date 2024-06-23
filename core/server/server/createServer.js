import { ROOT_MODULE as MODULE } from '@startupjs/registry'
import http from 'http'
import https from 'https'
import createExpress from './createExpress.js'

const PORT = process.env.PORT || 3000

let server = null

/**
 * Creates a dev/prod server with all the startupjs functionality
 */
export default async function createServer ({ backend, session, channel, options }) {
  const expressApp = await createExpress({ backend, session, channel, options })

  // Create server and setup websockets connection
  if (options.https) {
    server = https.createServer(options.https, expressApp)
  } else {
    server = http.createServer(expressApp)
  }
  MODULE.hook('createServer', server)

  if (process.env.SERVER_REQUEST_TIMEOUT != null) {
    server.timeout = ~~process.env.SERVER_REQUEST_TIMEOUT
  }

  server.on('upgrade', function (...args) {
    channel.upgrade(...args)
    MODULE.hook('serverUpgrade', ...args)
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
  // TODO: asyncHook does not wait for MODULE.on's to complete. Fix it
  await MODULE.asyncHook('beforeStart', props)

  server.listen = getListen(server, options)

  return { server, expressApp }
}

function getListen (server, options) {
  const oldListen = server.listen
  return function listen (...args) {
    const defaultCb = (err) => {
      if (err) {
        console.error('Server failed to start\n', err)
        throw Error('ERROR! Server failed to start')
      }
      printStarted()
    }
    const wrapCb = cb => {
      return function () {
        defaultCb.apply(this, arguments)
        cb?.apply(this, arguments)
      }
    }
    if (args.length === 0) {
      args = [PORT, defaultCb]
    } else if (args.length === 1 && typeof args[0] === 'function') {
      args = [PORT, wrapCb(args[0])]
    } else if (args.length === 1 && typeof args[0] === 'number') {
      args = [args[0], defaultCb]
    } else {
      args.map(arg => typeof arg === 'function' ? wrapCb(arg) : arg)
    }
    return oldListen.apply(server, args)
  }
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
  const port = PORT
  // Support for the `dev` shell script which runs startupjs app inside a Docker container
  const dockerHostPort = process.env.DOCKER_HOST_PORT
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
