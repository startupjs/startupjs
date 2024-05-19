import Cache from './Cache.js'
import Signal, { regularBindings, extremelyLateBindings, isPublicCollection, isPrivateCollection } from './Signal.js'
import { findModel } from './addModel.js'
import { LOCAL } from './$.js'
import { ROOT, ROOT_ID, GLOBAL_ROOT_ID } from './Root.js'
import { QUERIES } from './Query.js'

const PROXIES_CACHE = new Cache()
const PROXY_TO_SIGNAL = new WeakMap()

// extremely late bindings let you use fields in your raw data which have the same name as signal's methods
const USE_EXTREMELY_LATE_BINDINGS = true

// get proxy-wrapped signal from cache or create a new one
// TODO: move Private, Public, Local signals out of this file, same as Query has its own signal
export default function getSignal ($root, segments = [], {
  useExtremelyLateBindings = USE_EXTREMELY_LATE_BINDINGS,
  rootId,
  signalHash,
  proxyHandlers = getDefaultProxyHandlers({ useExtremelyLateBindings })
} = {}) {
  if (!($root instanceof Signal)) {
    if (segments.length === 0 && !rootId) throw Error(ERRORS.rootIdRequired)
    if (segments.length >= 1 && isPrivateCollection(segments[0])) {
      if (segments[0] === QUERIES) {
        // TODO: this is a hack to temporarily let the queries work.
        //       '$queries' collection is always added to the global (singleton) root signal.
        //       In future it should also be part of the particular root signal.
        $root = getSignal(undefined, [], { rootId: GLOBAL_ROOT_ID })
      } else {
        throw Error(ERRORS.rootSignalRequired)
      }
    }
  }
  signalHash ??= hashSegments(segments, $root?.[ROOT_ID] || rootId)
  let proxy = PROXIES_CACHE.get(signalHash)
  if (proxy) return proxy

  const SignalClass = getSignalClass(segments)
  const signal = new SignalClass(segments)
  proxy = new Proxy(signal, proxyHandlers)
  if (segments.length >= 1) {
    if (isPrivateCollection(segments[0])) {
      proxy[ROOT] = $root
    } else {
      // TODO: this is probably a hack, currently public collection signals don't need a root signal
      //       but without it calling the methods of root signal like $.get() doesn't work
      proxy[ROOT] = $root || getSignal(undefined, [], { rootId: GLOBAL_ROOT_ID })
    }
  }
  PROXY_TO_SIGNAL.set(proxy, signal)
  const dependencies = []

  // if the signal is a child of the local value created through the $() function,
  // we need to add the parent signal ('$local.id') to the dependencies so that it doesn't get garbage collected
  // before the child signal ('$local.id.firstName') is garbage collected.
  // Same goes for public collections -- we need to keep the document signal alive while its child signals are alive
  if (segments.length > 2) {
    if (segments[0] === LOCAL) {
      dependencies.push(getSignal($root, segments.slice(0, 2)))
    } else if (isPublicCollection(segments[0])) {
      dependencies.push(getSignal(undefined, segments.slice(0, 2)))
    }
  }

  PROXIES_CACHE.set(signalHash, proxy, dependencies)
  return proxy
}

function getDefaultProxyHandlers ({ useExtremelyLateBindings } = {}) {
  return useExtremelyLateBindings ? extremelyLateBindings : regularBindings
}

function hashSegments (segments, rootId) {
  if (segments.length === 0) {
    if (!rootId) throw Error(ERRORS.rootIdRequired)
    return JSON.stringify({ root: rootId })
  } else if (isPrivateCollection(segments[0])) {
    if (!rootId) throw Error(ERRORS.privateCollectionRootIdRequired(segments))
    return JSON.stringify({ private: [rootId, segments] })
  } else {
    return JSON.stringify(segments)
  }
}

export function getSignalClass (segments) {
  return findModel(segments) ?? Signal
}

export function rawSignal (proxy) {
  return PROXY_TO_SIGNAL.get(proxy)
}

export { PROXIES_CACHE as __DEBUG_SIGNALS_CACHE__ }

const ERRORS = {
  rootIdRequired: 'Root signal must have a rootId specified',
  privateCollectionRootIdRequired: segments => `Private collection signal must have a rootId specified. Segments: ${segments}`,
  rootSignalRequired: 'First argument of getSignal() for private collections must be a Root Signal'
}
