import isServer from '@startupjs/utils/isServer'
import Socket from '@startupjs/channel'
import racer from 'racer'

const DEFAULT_CLIENT_OPTIONS = {
  base: '/channel',
  reconnect: true,
  forceBrowserChannel: true, // TODO: change to false later when we expo check is implemented
  srvProtocol: undefined,
  srvHost: undefined,
  srvPort: undefined,
  srvSecurePort: undefined,
  timeout: 10000,
  timeoutIncrement: 10000
}
const DEFAULT_UNLOAD_DELAY = 3000 // short delay, like 100, might be better

if (!isServer) monkeyPatch()

function monkeyPatch () {
  racer.Model.prototype._createSocket = function () {
    const clientOptions = {
      ...DEFAULT_CLIENT_OPTIONS,
      ...(typeof window !== 'undefined' && window.__racerHighwayClientOptions)
    }
    return new Socket(clientOptions)
  }
}

export default function getModel () {
  const model = racer.createModel()

  // Specify the time it takes before unsubscribe actually fires
  const unloadDelay =
    (typeof window !== 'undefined' && window.__racerUnloadDelay) ||
    DEFAULT_UNLOAD_DELAY
  model.root.unloadDelay = unloadDelay
  return model
}
