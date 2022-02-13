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

export const DEBUG_CACHE_ACTIVE = true

const activeCaches = {}

export function createCaches (cacheNames) {
  if (!DEBUG_CACHE_ACTIVE) return { activate: () => {}, deactivate: () => {}, clear: () => {} }
  if (!cacheNames) throw Error(ERROR_NO_CACHE_NAMES)
  if (typeof cacheNames === 'string') cacheNames = [cacheNames]
  let caches = {}
  for (const cacheName of cacheNames) {
    caches[cacheName] = {}
    __increment(`cache.${cacheName}`)
  }
  return {
    activate () {
      if (!caches) return console.error(ERROR_CACHE_CLEARED)
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
        for (const i in caches[cacheName]) delete caches[cacheName][i]
        if (activeCaches[cacheName] === caches[cacheName]) activeCaches[cacheName] = undefined
        delete caches[cacheName]
        __decrement(`cache.${cacheName}`)
      }
      caches = undefined
    }
  }
}

export function singletonMemoize (fn, { cacheName, active = true, normalizer = defaultNormalizer } = {}) {
  if (!(DEBUG_CACHE_ACTIVE && active)) return fn
  if (!cacheName) throw Error(ERROR_NO_CACHE_NAME)
  return (...args) => {
    if (!activeCaches[cacheName]) return fn(...args)
    const id = normalizer(...args)
    // eslint-disable-next-line no-prototype-builtins
    if (activeCaches[cacheName].hasOwnProperty(id)) return activeCaches[cacheName][id]
    return (activeCaches[cacheName][id] = fn(...args))
  }
}

function defaultNormalizer (...args) {
  return JSON.stringify(args)
}

const ERROR_CACHE_CLEARED = 'WARNING! Cache was already cleared. This should never happen'
const ERROR_NO_CACHE_NAME = '[react-sharedb-util/cache/createCaches] You must specify the cache singleton names'
const ERROR_NO_CACHE_NAMES = '[react-sharedb-util/cache/memoize] You must specify the cache singleton name'
