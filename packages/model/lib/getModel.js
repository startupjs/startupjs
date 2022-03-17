import racer from 'racer'
import Socket from 'racer-highway/lib/browser/socket.js'

var isServer = typeof window === 'undefined'
var DEFAULT_CLIENT_OPTIONS = {
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
var DEFAULT_UNLOAD_DELAY = 3000 // short delay, like 100, might be better

racer.Model.prototype._createSocket = function () {
  var clientOptions =
    (typeof window !== 'undefined' && window.__racerHighwayClientOptions) ||
    DEFAULT_CLIENT_OPTIONS
  return new Socket(clientOptions)
}

export default function getModel () {
  if (isServer) return

  var model = racer.createModel()

  // Specify the time it takes before unsubscribe actually fires
  var unloadDelay =
    (typeof window !== 'undefined' && window.__racerUnloadDelay) ||
    DEFAULT_UNLOAD_DELAY
  model.root.unloadDelay = unloadDelay
  return model
}
