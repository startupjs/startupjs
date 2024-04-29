/**
 * Implementation of the BaseSignal class which is used as a base class for all signals
 * and can be extended to create custom models for a particular path pattern of the data tree.
 *
 * All signals in the app should be created using getSignal() function which automatically
 * determines the correct model for the given path pattern and wraps the signal object in a Proxy.
 *
 * Proxy is used for the following reasons:
 * 1. To allow accessing child signals using dot syntax
 * 2. To be able to call the top-level signal as a `$()` function
 * 3. If extremely late bindings are enabled, to prevent name collisions when accessing fields
 *    in the raw data tree which have the same name as signal's methods
 */
import { get as _get, set as _set } from './dataTree.js'
import $ from './$.js'

// extremely late bindings let you use fields in your raw data which have the same name as signal's methods
const USE_EXTREMELY_LATE_BINDINGS = true

export const SEGMENTS = Symbol('path segments targeting the particular node in the data tree')
const PROXIES_CACHE = new Map()
export { PROXIES_CACHE as __DEBUG_SIGNALS_CACHE__ }
const PROXIES_CACHE_FR = new FinalizationRegistry(cleanupProxiesCache)
export const MODELS = {}
const PROXY_TO_SIGNAL = new WeakMap()

export default class BaseSignal extends Function {
  constructor (segments) {
    if (!Array.isArray(segments)) throw Error('Signal constructor expects an array of segments')
    super()
    this[SEGMENTS] = segments
  }

  path () {
    return this[SEGMENTS].join('.')
  }

  get () {
    return _get(this[SEGMENTS])
  }

  async set (value) {
    _set(this[SEGMENTS], value)
  }

  // clone () {}
  // async assign () {}
  // async push () {}
  // async pop () {}
  // async unshift () {}
  // async shift () {}
  // async splice () {}
  // async move () {}
  // async del () {}
}

// dot syntax returns a child signal only if no such method or property exists
const regularBindings = {
  apply (signal, thisArg, argumentsList) {
    if (signal[SEGMENTS].length === 0) return Reflect.apply($, thisArg, argumentsList)
    throw Error('Signal can\'t be called as a function since extremely late bindings are disabled')
  },
  get (signal, key, receiver) {
    if (key in signal) return Reflect.get(signal, key, receiver)
    return Reflect.apply(extremelyLateBindings.get, this, arguments)
  }
}

// dot syntax always returns a child signal even if such method or property exists.
// The method is only called when the signal is explicitly called as a function,
// in which case we get the original method from the raw (non-proxied) parent signal
const extremelyLateBindings = {
  apply (signal, thisArg, argumentsList) {
    if (signal[SEGMENTS].length === 0) return Reflect.apply($, thisArg, argumentsList)
    const key = signal[SEGMENTS][signal[SEGMENTS].length - 1]
    const parentProxy = getSignal(signal[SEGMENTS].slice(0, -1))
    const parentSignal = rawSignal(parentProxy)
    if (!(key in parentSignal)) throw Error(`Method "${key}" does not exist on signal "${parentProxy[SEGMENTS].join('.')}"`)
    return Reflect.apply(parentSignal[key], parentProxy, argumentsList)
  },
  get (signal, key, receiver) {
    if (typeof key === 'symbol') return Reflect.get(signal, key, receiver)
    key = transformAlias(signal[SEGMENTS], key)
    return getSignal([...signal[SEGMENTS], key])
  }
}

// get proxy-wrapped signal from cache or create a new one
export function getSignal (segments = [], { useExtremelyLateBindings = USE_EXTREMELY_LATE_BINDINGS } = {}) {
  const signalHash = JSON.stringify(segments)
  let proxy = PROXIES_CACHE.get(signalHash)?.deref()
  if (proxy) return proxy

  const SignalClass = getSignalClass(segments)
  const signal = new SignalClass(segments)
  proxy = new Proxy(signal, useExtremelyLateBindings ? extremelyLateBindings : regularBindings)
  PROXY_TO_SIGNAL.set(proxy, signal)
  PROXIES_CACHE.set(signalHash, new WeakRef(proxy))
  PROXIES_CACHE_FR.register(proxy, signalHash)
  return proxy
}

function cleanupProxiesCache (signalHash) {
  PROXIES_CACHE.delete(signalHash)
}

export function getSignalClass (segments) {
  // if segments is an empty array, treat it as a top-level signal.
  // Top-level signal class is the one that has an empty string as a pattern.
  if (segments.length === 0) segments = ['']
  for (const pattern in MODELS) {
    const patternSegments = pattern.split('.')
    if (segments.length !== patternSegments.length) continue
    let match = true
    for (let i = 0; i < segments.length; i++) {
      if (patternSegments[i] !== '*' && patternSegments[i] !== segments[i]) {
        match = false
        break
      }
    }
    if (match) return MODELS[pattern]
  }
  return BaseSignal
}

export function rawSignal (proxy) {
  return PROXY_TO_SIGNAL.get(proxy)
}

export function addModel (pattern, Model) {
  if (typeof pattern !== 'string') throw Error('Model pattern must be a string, e.g. "users.*"')
  if (/\s/.test(pattern)) throw Error('Model pattern can not have spaces')
  if (typeof Model !== 'function') throw Error('Model must be a class')
  pattern = pattern.replace(/\[[^\]]+\]/g, '*') // replace `[id]` with `*`
  if (pattern !== '' && pattern.split('.').some(segment => segment === '')) {
    throw Error('Model pattern can not have empty segments')
  }
  if (MODELS[pattern]) throw Error(`Model for pattern "${pattern}" already exists`)
  MODELS[pattern] = Model
}

const transformAlias = (({
  collectionsMapping = {
    session: '_session',
    page: '_page',
    render: '$render',
    system: '$system'
  },
  regex$ = /^\$/
} = {}) => (segments, key) => {
  if (regex$.test(key)) key = key.slice(1)
  if (segments.length === 0) key = collectionsMapping[key] || key
  return key
})()
