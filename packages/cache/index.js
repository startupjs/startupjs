/**
 * Caching system for memoized functions which keeps track of which cache is currently active
 * (singleton cache) and uses the active cache in the memoized function
 *
 * Algorithm works the following way:
 *   1. initially observer() wrapper creates a new cache for the 'styles' singletonName just for the current component
 *   2. this will replace the previous active 'styles' cache with the new one
 *   3. memoized function has to specify which singleton cache it uses
 *   4. whenever observer() re-renders the component next time it will re-activate its cache
 *
 * IMPORTANT: You must do cache.clear() when you don't need it anymore otherwise you'll have HUGE memory leaks
 */
import { __increment, __decrement } from '@startupjs/debug'

// global setting to disable cache
export const CACHE_ACTIVE = { value: true }

// a global semaphore used to temporarily block cache
const BLOCK_CACHE = { value: false }

const activeCaches = {}

export function blockCache () {
  if (!BLOCK_CACHE.value) BLOCK_CACHE.value = true
}

export function unblockCache () {
  if (BLOCK_CACHE.value) BLOCK_CACHE.value = false
}

export function createCaches (cacheNames) {
  if (!CACHE_ACTIVE.value) return { activate: () => {}, deactivate: () => {}, clear: () => {} }
  if (!cacheNames) throw Error(ERROR_NO_CACHE_NAMES)
  if (typeof cacheNames === 'string') cacheNames = [cacheNames]
  let caches = {}
  for (const cacheName of cacheNames) {
    caches[cacheName] = new Map()
    __increment(`cache.${cacheName}`)
  }
  return {
    activate () {
      if (!caches) return console.error(ERROR_CACHE_CLEARED)
      unblockCache()
      for (const cacheName of cacheNames) activeCaches[cacheName] = caches[cacheName]
    },
    deactivate () {
      if (!caches) return console.error(ERROR_CACHE_CLEARED)
      for (const cacheName of cacheNames) {
        if (activeCaches[cacheName] === caches[cacheName]) activeCaches[cacheName] = undefined
      }
    },
    clear () {
      if (!caches) return console.error(ERROR_CACHE_CLEARED)
      for (const cacheName of cacheNames) {
        if (caches[cacheName].__isNested) {
          caches[cacheName].forEach(nestedMap => nestedMap instanceof Map && nestedMap.clear())
        }
        caches[cacheName].clear()
        if (activeCaches[cacheName] === caches[cacheName]) activeCaches[cacheName] = undefined
        delete caches[cacheName]
        __decrement(`cache.${cacheName}`)
      }
      caches = undefined
    }
  }
}

export function singletonMemoize (
  fn,
  {
    cacheName,
    active = true,
    // NOTE: if firstArgWeakMap is enabled you would want to ignore the first argument completely
    //       in the normalizer
    normalizer = defaultNormalizer,
    nestedThis = false
  } = {}
) {
  if (!(CACHE_ACTIVE.value && active)) return fn
  if (!cacheName) throw Error(ERROR_NO_CACHE_NAME)

  function getFromCache (cache, args) {
    const id = normalizer(...args)
    if (!cache.has(id)) cache.set(id, fn.call(this, ...args))
    return cache.get(id)
  }

  if (nestedThis) {
    return function (...args) {
      if (!activeCaches[cacheName] || BLOCK_CACHE.value) return fn.call(this, ...args)
      if (!activeCaches[cacheName].__isNested) activeCaches[cacheName].__isNested = true
      if (!activeCaches[cacheName].has(this)) activeCaches[cacheName].set(this, new Map())
      return getFromCache.call(this, activeCaches[cacheName].get(this), args)
    }
  } else {
    return function (...args) {
      if (!activeCaches[cacheName] || BLOCK_CACHE.value) return fn.call(this, ...args)
      return getFromCache.call(this, activeCaches[cacheName], args)
    }
  }
}

function defaultNormalizer (...args) {
  return JSON.stringify(args)
}

const ERROR_CACHE_CLEARED = 'WARNING! Cache was already cleared. This should never happen'
const ERROR_NO_CACHE_NAME = '[react-sharedb-util/cache/createCaches] You must specify the cache singleton names'
const ERROR_NO_CACHE_NAMES = '[react-sharedb-util/cache/memoize] You must specify the cache singleton name'
