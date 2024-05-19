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
import { get as _get, set as _set, del as _del, setPublicDoc as _setPublicDoc } from './dataTree.js'
import getSignal, { rawSignal } from './getSignal.js'
import { IS_QUERY, HASH, QUERIES } from './Query.js'
import { ROOT_FUNCTION, getRoot } from './Root.js'
import uuid from '../utils/uuid.cjs'

export const SEGMENTS = Symbol('path segments targeting the particular node in the data tree')

export default class Signal extends Function {
  constructor (segments) {
    if (!Array.isArray(segments)) throw Error('Signal constructor expects an array of segments')
    super()
    this[SEGMENTS] = segments
  }

  path () {
    if (arguments.length > 0) throw Error('Signal.path() does not accept any arguments')
    return this[SEGMENTS].join('.')
  }

  id () {
    return uuid()
  }

  get () {
    if (arguments.length > 0) throw Error('Signal.get() does not accept any arguments')
    if (this[IS_QUERY]) {
      const hash = this[HASH]
      return _get([QUERIES, hash, 'docs'])
    }
    return _get(this[SEGMENTS])
  }

  * [Symbol.iterator] () {
    if (this[IS_QUERY]) {
      const ids = _get([QUERIES, this[HASH], 'ids'])
      for (const id of ids) yield getSignal(getRoot(this), [this[SEGMENTS][0], id])
    } else {
      const items = _get(this[SEGMENTS])
      if (!Array.isArray(items)) return
      for (let i = 0; i < items.length; i++) yield getSignal(getRoot(this), [...this[SEGMENTS], i])
    }
  }

  map (...args) {
    if (this[IS_QUERY]) {
      const collection = this[SEGMENTS][0]
      const hash = this[HASH]
      const ids = _get([QUERIES, hash, 'ids'])
      return ids.map(id => getSignal(getRoot(this), [collection, id])).map(...args)
    }
    const items = _get(this[SEGMENTS])
    if (!Array.isArray(items)) return []
    return Array(items.length)
      .fill()
      .map((_, index) => getSignal(getRoot(this), [...this[SEGMENTS], index]))
      .map(...args)
  }

  async set (value) {
    if (arguments.length > 1) throw Error('Signal.set() expects a single argument')
    if (this[SEGMENTS].length === 0) throw Error('Can\'t set the root signal data')
    if (isPublicCollection(this[SEGMENTS][0])) {
      await _setPublicDoc(this[SEGMENTS], value)
    } else {
      _set(this[SEGMENTS], value)
    }
  }

  // TODO: make it use an actual increment json0 operation on public collections
  async increment (value) {
    if (arguments.length > 1) throw Error('Signal.increment() expects a single argument')
    if (value === undefined) value = 1
    if (typeof value !== 'number') throw Error('Signal.increment() expects a number argument')
    let currentValue = this.get()
    if (currentValue === undefined) currentValue = 0
    if (typeof currentValue !== 'number') throw Error('Signal.increment() tried to increment a non-number value')
    await this.set(currentValue + value)
  }

  async add (value) {
    if (arguments.length > 1) throw Error('Signal.add() expects a single argument')
    let id
    if (value.id) {
      value = JSON.parse(JSON.stringify(value))
      id = value.id
      delete value.id
    }
    id ??= uuid()
    await this[id].set(value)
  }

  async del () {
    if (arguments.length > 0) throw Error('Signal.del() does not accept any arguments')
    if (this[SEGMENTS].length === 0) throw Error('Can\'t delete the root signal data')
    if (isPublicCollection(this[SEGMENTS][0])) {
      if (this[SEGMENTS].length === 1) throw Error('Can\'t delete the whole collection')
      await _setPublicDoc(this[SEGMENTS], undefined, true)
    } else {
      _del(this[SEGMENTS])
    }
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
    if (signal[SEGMENTS].length === 0) {
      if (!signal[ROOT_FUNCTION]) throw Error(ERRORS.noRootFunction)
      return signal[ROOT_FUNCTION].call(thisArg, signal, ...argumentsList)
    }
    throw Error('Signal can\'t be called as a function since extremely late bindings are disabled')
  },
  get (signal, key, receiver) {
    if (key in signal) return Reflect.get(signal, key, receiver)
    return Reflect.apply(extremelyLateBindings.get, this, arguments)
  }
}

const QUERY_METHODS = ['map', 'get']

// dot syntax always returns a child signal even if such method or property exists.
// The method is only called when the signal is explicitly called as a function,
// in which case we get the original method from the raw (non-proxied) parent signal
export const extremelyLateBindings = {
  apply (signal, thisArg, argumentsList) {
    if (signal[SEGMENTS].length === 0) {
      if (!signal[ROOT_FUNCTION]) throw Error(ERRORS.noRootFunction)
      return signal[ROOT_FUNCTION].call(thisArg, signal, ...argumentsList)
    }
    const key = signal[SEGMENTS][signal[SEGMENTS].length - 1]
    const $parent = getSignal(getRoot(signal), signal[SEGMENTS].slice(0, -1))
    const rawParent = rawSignal($parent)
    if (!(key in rawParent)) {
      throw Error(`Method "${key}" does not exist on signal "${$parent[SEGMENTS].join('.')}"`)
    }
    return Reflect.apply(rawParent[key], $parent, argumentsList)
  },
  get (signal, key, receiver) {
    if (typeof key === 'symbol') return Reflect.get(signal, key, receiver)
    if (key === 'then') return undefined // handle checks for whether the symbol is a Promise
    key = transformAlias(signal[SEGMENTS], key)
    if (signal[IS_QUERY]) {
      if (key === 'ids') return getSignal(getRoot(signal), [QUERIES, signal[HASH], 'ids'])
      if (QUERY_METHODS.includes(key)) return Reflect.get(signal, key, receiver)
    }
    return getSignal(getRoot(signal), [...signal[SEGMENTS], key])
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

export function isPublicCollectionSignal ($signal) {
  return $signal instanceof Signal && $signal[SEGMENTS].length === 1 && isPublicCollection($signal[SEGMENTS][0])
}

export function isPublicDocumentSignal ($signal) {
  return $signal instanceof Signal && $signal[SEGMENTS].length === 2 && isPublicCollection($signal[SEGMENTS][0])
}

export function isPublicCollection (collectionName) {
  if (!collectionName) return false
  return !isPrivateCollection(collectionName)
}

export function isPrivateCollection (collectionName) {
  if (!collectionName) return false
  return /^[_$]/.test(collectionName)
}

const ERRORS = {
  noRootFunction: `
    Root signal does not have a root function set.
    You must use getRootSignal({ rootId, rootFunction }) to create a root signal.
  `
}
