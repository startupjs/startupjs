import WebSocket from 'ws'
import { server as BrowserChannelServer } from 'browserchannel'
import crypto from 'crypto'
import createBrowserChannelStream from './createBrowserChannelStream'
import createWebSocketStream from './createWebSocketStream'

const defaultServerOptions = {
  session: null,
  base: '/channel',
  noPing: false,
  pingInterval: 30000
}

export default function (backend, serverOptions = {}) {
  serverOptions = { ...defaultServerOptions, ...serverOptions }

  // ws-module specific options
  serverOptions.path = serverOptions.base
  serverOptions.noServer = true

  const middleware = BrowserChannelServer(serverOptions, function (client, connectRequest) {
    if (serverOptions.session) {
      // https://github.com/expressjs/session/pull/57
      if (!connectRequest.originalUrl) connectRequest.originalUrl = connectRequest.url
      serverOptions.session(connectRequest, {}, startBrowserChannel)
    } else {
      startBrowserChannel()
    }

    function startBrowserChannel () {
      let rejected = false
      let rejectReason
      function reject (reason) {
        rejected = true
        if (reason) rejectReason = reason
      }

      if (connectRequest.session) client.connectSession = connectRequest.session

      backend.emit('client', client, reject)
      if (rejected) {
        // Tell the client to stop trying to connect
        client.stop(function () {
          client.close(rejectReason)
        })
        return
      }
      const stream = createBrowserChannelStream(client)
      doneInitialization(backend, stream, connectRequest)
    }
  })

  const wss = new WebSocket.Server(serverOptions)

  wss.on('connection', function (client) {
    client.id = crypto.randomBytes(16).toString('hex')

    // Some proxy drop out long connections
    // so do ping periodically to prevent this
    // interval = 30s by default
    if (!serverOptions.noPing) {
      client.timer = setInterval(function () {
        if (client.readyState === WebSocket.OPEN) {
          client.ping()
        } else {
          clearInterval(client.timer)
        }
      }, serverOptions.pingInterval)
    }

    let rejected = false
    let rejectReason

    function reject (reason) {
      rejected = true
      if (reason) rejectReason = reason
    }

    if (client.upgradeReq.session) client.connectSession = client.upgradeReq.session

    backend.emit('client', client, reject)
    if (rejected) {
      // Tell the client to stop trying to connect
      client.close(1001, rejectReason)
      return
    }

    const stream = createWebSocketStream(client)
    doneInitialization(backend, stream, client.upgradeReq)
  })

  function upgrade (req, socket, upgradeHead) {
    // copy upgradeHead to avoid retention of large slab buffers used in node core
    const head = Buffer.alloc(upgradeHead.length)
    upgradeHead.copy(head)

    if (serverOptions.session) {
      // https://github.com/expressjs/session/pull/57
      if (!req.originalUrl) req.originalUrl = req.url
      serverOptions.session(req, {}, next)
    } else {
      next()
    }

    function next () {
      wss.handleUpgrade(req, socket, head, function (client) {
        wss.emit('connection' + req.url, client)
        wss.emit('connection', client)
      })
    }
  }

  if (serverOptions.session) {
    backend.use('connect', function (shareRequest, next) {
      const req = shareRequest.req
      const agent = shareRequest.agent

      if (!agent.connectSession && req && req.session) {
        agent.connectSession = req.session
      }

      next()
    })
  }

  return { upgrade, middleware, wss }
}

function doneInitialization (backend, stream, request) {
  backend.on('connect', function (data) {
    const agent = data.agent
    if (request.session) agent.connectSession = request.session
    backend.emit('share agent', agent, stream)
  })

  backend.listen(stream, request)
}
