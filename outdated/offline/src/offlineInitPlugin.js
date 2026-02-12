// import '@startupjs/model/lib/getModel'
throw Error('@startupjs/model does not exist anymore. This module has to be updated to work on the new teamplay library.')
import { Thread } from 'react-native-threads'
import racer from 'racer'
import { Socket, Messenger } from 'sharedb-offline'

const DEFAULT_CLIENT_OPTIONS = {
  base: '/channel',
  reconnect: true,
  browserChannelOnly: false,
  srvProtocol: undefined,
  srvHost: undefined,
  srvPort: undefined,
  srvSecurePort: undefined,
  timeout: 10000,
  timeoutIncrement: 10000
}

function getWebSocketURL (options) {
  let port

  if (window.location && window.location.port) {
    port = ':' + window.location.port
  }

  const srvPort = options.srvPort
  const srvSecurePort = options.srvSecurePort

  const srvHost = options.srvHost || window.location.hostname
  const srvProtocol = options.srvProtocol || window.location.protocol

  const protocol = srvProtocol === 'https:' ? 'wss:' : 'ws:'

  if (protocol === 'ws:' && srvPort) {
    port = ':' + srvPort
  } else if (protocol === 'wss:' && srvSecurePort) {
    port = ':' + srvSecurePort
  }
  return protocol + '//' + srvHost + (port || '') + options.base
}

export default function offlineInitPlugin (options = {}) {
  racer.Model.prototype._createSocket = function () {
    const clientOptions =
      (typeof window !== 'undefined' && window.__racerHighwayClientOptions) ||
      DEFAULT_CLIENT_OPTIONS

    const url = getWebSocketURL(clientOptions)
    const worker = new Thread('worker.thread.js')
    const workerMessenger = new Messenger(worker, 'client')
    const socket = new Socket(Object.assign({}, { workerMessenger, url }, options.socketParams || {}))

    this.set('$connection.offlineState', socket.getState())
    socket.ee.on('state', state => {
      this.set('$connection.offlineState', state.state)
    })

    setTimeout(() => {
      this.socket.connection = this.connection
    }, 0)

    return socket
  }
}
