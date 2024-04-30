import Cache from './Cache.js'
import Signal, { regularBindings, extremelyLateBindings } from './Signal.js'
import { findModel } from './addModel.js'
import { LOCAL } from './$.js'

const PROXIES_CACHE = new Cache()
const PROXY_TO_SIGNAL = new WeakMap()

// extremely late bindings let you use fields in your raw data which have the same name as signal's methods
const USE_EXTREMELY_LATE_BINDINGS = true

// get proxy-wrapped signal from cache or create a new one
export default function getSignal (segments = [], {
  useExtremelyLateBindings = USE_EXTREMELY_LATE_BINDINGS
} = {}) {
  const signalHash = JSON.stringify(segments)
  let proxy = PROXIES_CACHE.get(signalHash)
  if (proxy) return proxy

  const SignalClass = getSignalClass(segments)
  const signal = new SignalClass(segments)
  proxy = new Proxy(signal, useExtremelyLateBindings ? extremelyLateBindings : regularBindings)
  PROXY_TO_SIGNAL.set(proxy, signal)
  const dependencies = []

  // if the signal is a child of the local value created through the $() function,
  // we need to add the parent signal ('$local.id') to the dependencies so that it doesn't get garbage collected
  // before the child signal ('$local.id.firstName') is garbage collected
  if (segments.length > 2 && segments[0] === LOCAL) dependencies.push(getSignal(segments.slice(0, 2)))

  PROXIES_CACHE.set(signalHash, proxy, dependencies)
  return proxy
}

export function getSignalClass (segments) {
  return findModel(segments) ?? Signal
}

export function rawSignal (proxy) {
  return PROXY_TO_SIGNAL.get(proxy)
}

export { PROXIES_CACHE as __DEBUG_SIGNALS_CACHE__ }
