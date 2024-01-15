import isServer from '@startupjs/utils/isServer'
import Socket from '@startupjs/channel'
import racer from 'racer'

const DEFAULT_SOCKET_OPTIONS = {
  base: '/channel',
  reconnect: true,
  allowXhrFallback: false,
  forceXhrFallback: false,
  baseUrl: undefined,
  timeout: 10000,
  timeoutIncrement: 10000
}
const DEFAULT_UNLOAD_DELAY = 3000 // short delay, like 100, might be better

if (!isServer) monkeyPatch()

function monkeyPatch () {
  racer.Model.prototype._createSocket = function () {
    const clientOptions = {
      ...DEFAULT_SOCKET_OPTIONS,
      ...globalThis.__startupjsChannelOptions
    }
    return new Socket(clientOptions)
  }
}

export default function getModel () {
  const model = racer.createModel()

  // Specify the time it takes before unsubscribe actually fires
  const unloadDelay =
    (globalThis.__racerUnloadDelay) ||
    DEFAULT_UNLOAD_DELAY
  model.root.unloadDelay = unloadDelay
  return model
}
