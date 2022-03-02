import {
  useMemo,
  useLayoutEffect,
  useRef,
  useCallback
} from 'react'
import Doc from '../types/Doc.js'
import Query from '../types/Query.js'
import QueryExtra from '../types/QueryExtra.js'
import Local from '../types/Local.js'
import Value from '../types/Value.js'
import Api from '../types/Api.js'
import { batching } from '@startupjs/react-sharedb-util'
import { blockCache, unblockCache } from '@startupjs/cache'

import {
  subDoc,
  subLocal,
  subValue,
  subQuery,
  subApi
} from '../subscriptionTypeFns.js'
import $root from '@startupjs/model'
import destroyer from './destroyer.js'
import isArray from 'lodash/isArray.js'
import promiseBatcher from './promiseBatcher.js'

const HOOKS_COLLECTION = '$hooks'
const $hooks = $root.scope(HOOKS_COLLECTION)
const WARNING_MESSAGE = "[react-sharedb] Warning. Item couldn't initialize. " +
  'This might be normal if several resubscriptions happened ' +
  'quickly one after another. Error:'

export const useDoc = generateUseItemOfType(subDoc)
export const useDoc$ = generateUseItemOfType(subDoc, { modelOnly: true })
export const useBatchDoc = generateUseItemOfType(subDoc, { batch: true })
export const useBatchDoc$ = generateUseItemOfType(subDoc, { batch: true, modelOnly: true })
export const useAsyncDoc = generateUseItemOfType(subDoc, { optional: true })
export const useAsyncDoc$ = generateUseItemOfType(subDoc, { optional: true, modelOnly: true })

// NOTE: useQuery$ doesn't make sense because the returned model simply targets collection,
//       so instead just a simple useModel(collection) should be used.
export const useQuery = generateUseItemOfType(subQuery)
export const useBatchQuery = generateUseItemOfType(subQuery, { batch: true })
export const useAsyncQuery = generateUseItemOfType(subQuery, { optional: true })

export const useApi = generateUseItemOfType(subApi)
export const useApi$ = generateUseItemOfType(subApi, { modelOnly: true })
export const useBatchApi = generateUseItemOfType(subApi, { batch: true })
export const useBatchApi$ = generateUseItemOfType(subApi, { batch: true, modelOnly: true })
export const useAsyncApi = generateUseItemOfType(subApi, { optional: true })
export const useAsyncApi$ = generateUseItemOfType(subApi, { optional: true, modelOnly: true })

export const useLocal = generateUseItemOfType(subLocal)
export const useLocal$ = generateUseItemOfType(subLocal, { modelOnly: true })
export const useValue = generateUseItemOfType(subValue)
export const useValue$ = generateUseItemOfType(subValue, { modelOnly: true })

function generateUseItemOfType (typeFn, { optional, batch, modelOnly } = {}) {
  const isQuery = typeFn === subQuery
  const takeOriginalModel = typeFn === subDoc || typeFn === subLocal
  const isSync = typeFn === subLocal || typeFn === subValue
  return (...args) => {
    // block caching of 'model.at' and 'model.scope' since the caching of model
    // is handled on its own by these hooks
    blockCache()

    const hookId = useMemo(() => $root.id(), [])
    const hashedArgs = useMemo(() => JSON.stringify(args), args)

    const initsCountRef = useRef(0)
    const cancelInitRef = useRef()
    const itemRef = useRef()
    const destructorsRef = useRef([])

    const destroy = useCallback(() => {
      if (cancelInitRef.current) cancelInitRef.current.value = true
      itemRef.current = undefined
      destructorsRef.current.forEach(destroy => destroy())
      destructorsRef.current.length = 0
      $hooks.destroy(hookId)
    }, [])

    // For normal component destruction process
    useUnmount(destroy)

    // Manual destruction handling for the case of
    // throwing Promise out of hook
    useSync(() => destroyer.add(destroy), [])

    const params = useMemo(() => typeFn(...args), [hashedArgs])

    function finishInit () {
      // destroy the previous item and all unsuccessful item inits which happened until now.
      // Unsuccessful inits means the inits of those items which were cancelled, because
      // while the subscription was in process, another new item init started
      // (this might happen when the query parameter, like text search, changes quickly)
      // Don't destroy self though.
      destructorsRef.current.forEach((destroy, index) => {
        if (index !== destructorsRef.current.length - 1) destroy()
      })

      // Clear all destructors array other then current item's destroy
      destructorsRef.current.splice(0, destructorsRef.current.length - 1)

      // Mark that initialization completed
      initsCountRef.current++

      // Reference the new item data
      itemRef.current && itemRef.current.refModel()
    }

    function initItem (params) {
      const item = getItemFromParams(params, $hooks, hookId)
      destructorsRef.current.push(() => {
        item.unrefModel()
        item.destroy()
      })

      if (isSync) {
        // since initialization happens synchronously,
        // there is no need to bother with cancellation of
        // the previous item
        itemRef.current = item
        batching.batch(finishInit)
      } else {
        // Cancel initialization of the previous item
        if (cancelInitRef.current) cancelInitRef.current.value = true
        // and init new
        const cancelInit = {}
        cancelInitRef.current = cancelInit

        // If there is no previous item, it means we are the first
        const firstItem = !itemRef.current
        // Cancel previous item
        if (itemRef.current) itemRef.current.cancel()
        // and init new
        itemRef.current = item

        // It might or might NOT return the promise, depending on whether
        // we need to wait for the new data
        try {
          const initPromise = item.init(firstItem, { optional, batch })
          // Mark promiseBatching active whenever at least one useBatch* was
          // executed. Later it has to be finalized with the useBatch() call
          // which is what we are checking at the end of the rendering
          // in observer()
          if (batch) promiseBatcher.activate()
          // Batch multiple hooks together
          // Don't do any actual initialization in that case,
          // since we only care about gathering subscription promises
          if (initPromise && initPromise.type === 'batch') {
            return
          // Async variant
          } else if (initPromise) {
            initPromise.then(() => {
              // Handle situation when a new item already started initializing
              // and it cancelled this (old) item.
              // This is only possible when the current item was initializing
              // asynchronously
              if (cancelInit.value) return
              batching.batch(finishInit)
            }).catch(err => {
              console.warn(WARNING_MESSAGE, err)
              // Ignore the .init() error
              return Promise.resolve()
            })
          // Sync variant (when data is taken from cache)
          } else {
            batching.batch(finishInit)
          }
        } catch (err) {
          // rethrow if it's a Promise for <Suspend> to catch it
          if (err.then) throw err
          console.warn(WARNING_MESSAGE, err)
        }
      }
    }

    useSync(() => initItem(params), [hashedArgs])

    // ----- model -----

    // For Query and QueryExtra return the scoped model targeting the actual collection path.
    // This is much more useful since you can use that use this returned model
    // to update items with: $queryCollection.at(itemId).set('title', 'FooBar')
    const collectionName = useMemo(
      () => (isQuery ? getCollectionName(params) : undefined),
      [hashedArgs]
    )
    const $queryCollection = useMemo(
      () => (isQuery ? $root.scope(collectionName) : undefined),
      [collectionName]
    )

    // For Doc, Local, Value return the model scoped to the hook path
    // But only after the initialization actually finished, otherwise
    // the ORM won't be able to properly resolve the path which was not referenced yet
    const $model = useMemo(
      () => {
        if (isQuery || !initsCountRef.current) return
        // For Doc and Local return original path
        // TODO: Maybe add Api here too
        if (takeOriginalModel) {
          return $root.scope(getPath(params))
        // For Value, Api return hook's path since it's only stored there
        } else {
          return $hooks.at(hookId)
        }
      },
      [initsCountRef.current]
    )

    // unblock caching 'model.at' and 'model.scope'
    unblockCache()

    // if modelOnly was passed, we return just the model.
    // Using model-only hooks when you don't need data is important for optimization
    // because it won't trigger extra rerenders when the data itself changes.
    // And in many situations we don't need the data itself because of 2-way bindings
    // (when component itself accepts a writable model for one of its attributes)

    if (modelOnly) {
      return $queryCollection || $model
    } else {
      // ----- data -----

      // In any situation force access data through the object key to let observer know that the data was accessed
      const data = $hooks.get()[hookId]

      // ----- return -----

      return [
        initsCountRef.current
          ? (typeFn === subQuery && isArray(data) ? data.filter(Boolean) : data)
          : undefined,

        // Query, QueryExtra: return scoped model to collection path.
        // Everything else: return the 'hooks.<randomHookId>' scoped model.
        // TODO: don't create hooks.* for hooks where we can return an original reference (useDoc, useLocal, etc.)
        $queryCollection || $model,

        // explicit ready flag, has a second meaning as the inits counter (for each time query params change)
        initsCountRef.current
      ]
    }
  }
}

export function useBatch () {
  const promise = promiseBatcher.getPromiseAll()
  if (promise) throw promise
}

export function getCollectionName (params) {
  return params && params.params && params.params[0]
}

export function getPath (params) {
  if (!params) {
    // This should never happen
    console.warn('[react-sharedb] Unknown Param')
    return '__ERROR__.unknownParam'
  }
  const type = params.__subscriptionType
  switch (type) {
    case 'Local':
      return params.params
    case 'Doc':
      return params.params && params.params.join('.')
  }
}

export function getItemFromParams (params, model, key) {
  const explicitType = params && params.__subscriptionType
  const subscriptionParams = params.params
  const constructor = getItemConstructor(explicitType)
  return new constructor(model, key, subscriptionParams)
}

function getItemConstructor (type) {
  switch (type) {
    case 'Local':
      return Local
    case 'Doc':
      return Doc
    case 'Query':
      return Query
    case 'QueryExtra':
      return QueryExtra
    case 'Value':
      return Value
    case 'Api':
      return Api
    default:
      throw new Error('Unsupported subscription type: ' + type)
  }
}

function useUnmount (fn) {
  useLayoutEffect(() => fn, [])
}

function useSync (fn, inputs) {
  useMemo(() => {
    fn()
  }, inputs)
}
