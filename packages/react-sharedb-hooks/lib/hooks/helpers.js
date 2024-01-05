import { useMemo } from 'react'
import useIsomorphicLayoutEffect from '@startupjs/utils/useIsomorphicLayoutEffect'
import $root from '@startupjs/model'
import { blockCache, unblockCache } from '@startupjs/cache'
import { useQuery, useLocal, useBatchQuery, useAsyncQuery, useLocal$ } from './types.js'

export const emit = $root.emit.bind($root)

export function useModel (...args) {
  blockCache() // block model.at, model.scope caching since it's handled manually here
  const res = useMemo(() => $root.scope(...args), [...args])
  unblockCache() // unblock model caching
  return res
}

export function useOn (...args) {
  useIsomorphicLayoutEffect(() => {
    const [eventName] = args
    const listener = $root.on(...args)
    return () => {
      $root.removeListener(eventName, listener)
    }
  })
}

export function useEmit () {
  return emit
}

export function generateUseQueryIds ({ batch, optional } = {}) {
  const useFn = batch
    ? useBatchQuery
    : optional
      ? useAsyncQuery
      : useQuery
  return (collection, ids = [], options = {}) => {
    const [, $items, ready] = useFn(collection, { _id: { $in: ids } })
    if (!ready) return [undefined, $items, ready]
    if (options.reverse) ids = ids.slice().reverse()
    const items = ids.map(id => $root.get(`${collection}.${id}`)).filter(Boolean)
    return [items, $items, ready]
  }
}

// NOTE: useQueryIds$ doesn't make sense because the returned model simply targets collection,
//       so instead just a simple useModel(collection) should be used.
export const useQueryIds = generateUseQueryIds()
export const useBatchQueryIds = generateUseQueryIds({ batch: true })
export const useAsyncQueryIds = generateUseQueryIds({ optional: true })

// NOTE: `useQueryDoc$` does not provide any performance optimizations because it needs to
//       access data in order to create scoped model.
//       But it still makes sense to provide it for the sake of keeping the feature parity with `useDoc$`
export function generateUseQueryDoc ({ batch, optional, modelOnly } = {}) {
  const useFn = batch
    ? useBatchQuery
    : optional
      ? useAsyncQuery
      : useQuery
  return (collection, query) => {
    blockCache() // block model.at, model.scope caching since it's handled manually here
    query = Object.assign({}, query, { $limit: 1 })
    if (!query.$sort) query.$sort = { createdAt: -1 }
    const [items = [], , ready] = useFn(collection, query)
    const itemId = items[0] && items[0].id
    const $item = useMemo(
      () => {
        if (!itemId) return
        return $root.at(`${collection}.${itemId}`)
      },
      [itemId]
    )
    unblockCache() // unblock model caching
    if (!ready || !itemId) {
      if (modelOnly) return undefined
      return [undefined, undefined, ready]
    } else {
      if (modelOnly) return $item
      return [$root.get(`${collection}.${itemId}`), $item, ready]
    }
  }
}

export const useQueryDoc = generateUseQueryDoc()
export const useQueryDoc$ = generateUseQueryDoc({ modelOnly: true })
export const useBatchQueryDoc = generateUseQueryDoc({ batch: true })
export const useBatchQueryDoc$ = generateUseQueryDoc({ batch: true, modelOnly: true })
export const useAsyncQueryDoc = generateUseQueryDoc({ optional: true })
export const useAsyncQueryDoc$ = generateUseQueryDoc({ optional: true, modelOnly: true })

export function useLocalDoc (collection, docId) {
  console.warn(`
    useLocalDoc() is DEPRECATED! Instead use useDoc() the same exact way.
    useLocalDoc() will be removed in the next release!
  `)
  if (typeof collection !== 'string') {
    throw new Error(
      `[react-sharedb] useLocalDoc(): \`collection\` must be a String. Got: ${collection}`
    )
  }
  if (!docId) {
    console.warn(`
      [react-sharedb] useLocalDoc(): You are trying to subscribe to an undefined document id:
        ${collection}.${docId}
      Falling back to '__NULL__' document to prevent critical crash.
      You should prevent situations when the \`docId\` is undefined.
    `)
    docId = '__NULL__'
  }
  return useLocal(collection + '.' + docId)
}

export function generateUseSession ({ modelOnly } = {}) {
  const useFn = modelOnly
    ? useLocal$
    : useLocal
  return (path) => {
    if (typeof path !== 'string') {
      throw new Error(
        `[react-sharedb] useSession(): \`path\` must be a String. Got: ${path}`
      )
    }
    return useFn('_session' + '.' + path)
  }
}

export const useSession = generateUseSession()
export const useSession$ = generateUseSession({ modelOnly: true })

export function generateUsePage ({ modelOnly } = {}) {
  const useFn = modelOnly
    ? useLocal$
    : useLocal
  return (path) => {
    if (typeof path !== 'string') {
      throw new Error(
        `[react-sharedb] usePage(): \`path\` must be a String. Got: ${path}`
      )
    }
    return useFn('_page' + '.' + path)
  }
}

export const usePage = generateUsePage()
export const usePage$ = generateUsePage({ modelOnly: true })
