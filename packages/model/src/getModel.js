import racer from 'racer'
import Socket from 'racer-highway/lib/browser/socket'
let isServer = typeof window === 'undefined'
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
const DEFAULT_UNLOAD_DELAY = 3000 // short delay, like 100, might be better

racer.Model.prototype._createSocket = function () {
  let clientOptions =
    (typeof window !== 'undefined' && window.__racerHighwayClientOptions) ||
    DEFAULT_CLIENT_OPTIONS
  return new Socket(clientOptions)
}

export default function getModel () {
  if (isServer) return

  // Try to unbundle server-side model
  let bundleElement =
    typeof document !== 'undefined' &&
    document.getElementById &&
    document.getElementById('bundle')
  let serializedModel = bundleElement && bundleElement.innerHTML

  let model

  if (serializedModel) {
    model = racer.createModel(JSON.parse(serializedModel))
  } else {
    model = racer.createModel()
    console.warn('No model bundle received from the server')
  }

  // Specify the time it takes before unsubscribe actually fires
  let unloadDelay =
    (typeof window !== 'undefined' && window.__racerUnloadDelay) ||
    DEFAULT_UNLOAD_DELAY
  model.root.unloadDelay = unloadDelay
  return model
}
