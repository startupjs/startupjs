/* global FinalizationRegistry, WeakRef */
import handlers from './handlers.js'
import { getRootModel } from './model.js'

export const SEGMENTS = Symbol('path segments')
export const MODEL = Symbol('scoped model')
export const PROXY = Symbol('weak ref to the proxy itself, to be used within proxy handlers')
export const QUERY = Symbol('racer query')
export const IS_EXTRA_QUERY = Symbol('is extra query')

export function isInternalSymbol (symbol) {
  if (typeof symbol !== 'symbol') return false
  return [SEGMENTS, MODEL, PROXY, QUERY, IS_EXTRA_QUERY].includes(symbol)
}

const signalsCache = new Map()
export const __DEBUG_SIGNALS_CACHE__ = signalsCache
const signalsFinalizationRegistry = new FinalizationRegistry(hash => signalsCache.delete(hash))

export function getSignal (segments = []) {
  // when it's a proxyTarget or proxy itself
  if (segments[PROXY]) return segments[PROXY].deref()
  // when it's a Racer Query
  let query
  if (segments.collectionName && segments.getIds && segments.hash && segments.expression) {
    query = segments
    segments = [query.collectionName]
  }
  // when it's a racer model
  if (!Array.isArray(segments) && typeof segments !== 'string' && segments.path) segments = segments.path()
  // when it's a path string
  if (typeof segments === 'string') segments = segments.split('.')
  // when it's an array of segments
  if (!Array.isArray(segments)) throw new Error('signal() argument must be a string, segments array or a racer model')

  const signalHash = getSignalHash(segments, query)
  const signalRef = signalsCache.get(signalHash)

  if (signalRef) {
    const signal = signalRef.deref()
    if (signal !== undefined) return signal
  }

  return createAndCacheSignal(segments, signalHash, query)
}

function getSignalHash (segments, query) {
  const hashObject = query ? { p: segments, q: query.hash } : segments
  return JSON.stringify(hashObject)
}

function createAndCacheSignal (segments, signalHash, query) {
  let signal = function () {}
  signal[SEGMENTS] = segments
  if (query) {
    signal[QUERY] = query
    if (isExtraQuery(query.expression)) signal[IS_EXTRA_QUERY] = true
  }
  signal = new Proxy(signal, handlers)
  signalsFinalizationRegistry.register(signal, signalHash)
  signal[PROXY] = new WeakRef(signal)
  signalsCache.set(signalHash, signal[PROXY])
  return signal
}

export function getParentSignal (proxyTarget) {
  const segments = proxyTarget[SEGMENTS]
  if (segments.length === 0) return getSignal(proxyTarget)
  return getSignal(segments.slice(0, -1))
}

export function getLeaf (proxyTarget) {
  const segments = proxyTarget[SEGMENTS]
  return segments[segments.length - 1]
}

export function getModel (proxyTarget) {
  if (!proxyTarget[MODEL]) proxyTarget[MODEL] = getRootModel().scope(proxyTarget[SEGMENTS].join('.'))
  return proxyTarget[MODEL]
}

const EXTRA_QUERY_FIELDS = ['$count', '$aggregate', '$queryName', '$aggregationName']
export const isExtraQuery = expression => EXTRA_QUERY_FIELDS.some(field => field in expression)
