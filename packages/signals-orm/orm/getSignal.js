import Cache from './Cache.js'
import Signal, { regularBindings, extremelyLateBindings } from './Signal.js'
import { findModel } from './addModel.js'

const PROXIES_CACHE = new Cache()
const PROXY_TO_SIGNAL = new WeakMap()

// extremely late bindings let you use fields in your raw data which have the same name as signal's methods
const USE_EXTREMELY_LATE_BINDINGS = true

// get proxy-wrapped signal from cache or create a new one
export default function getSignal (segments = [], { useExtremelyLateBindings = USE_EXTREMELY_LATE_BINDINGS } = {}) {
  const signalHash = JSON.stringify(segments)
  let proxy = PROXIES_CACHE.get(signalHash)
  if (proxy) return proxy

  const SignalClass = getSignalClass(segments)
  const signal = new SignalClass(segments)
  proxy = new Proxy(signal, useExtremelyLateBindings ? extremelyLateBindings : regularBindings)
  PROXY_TO_SIGNAL.set(proxy, signal)
  PROXIES_CACHE.set(signalHash, proxy)
  return proxy
}

export function getSignalClass (segments) {
  return findModel(segments) ?? Signal
}

export function rawSignal (proxy) {
  return PROXY_TO_SIGNAL.get(proxy)
}

export { PROXIES_CACHE as __DEBUG_SIGNALS_CACHE__ }
