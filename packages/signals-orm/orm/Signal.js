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
import getSignal, { rawSignal } from './getSignal.js'
import $ from './$.js'

export const SEGMENTS = Symbol('path segments targeting the particular node in the data tree')

export default class Signal extends Function {
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
export const regularBindings = {
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
export const extremelyLateBindings = {
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
