import {
  useMemo,
  useLayoutEffect,
  useRef,
  useCallback
} from 'react'
import Doc from '../types/Doc'
import Query from '../types/Query'
import QueryExtra from '../types/QueryExtra'
import Local from '../types/Local'
import Value from '../types/Value'
import Api from '../types/Api'
import batching from '../batching'
import {
  subDoc,
  subLocal,
  subValue,
  subQuery,
  subApi
} from '../subscriptionTypeFns'
import $root from '@startupjs/model'
import destroyer from './destroyer'
import isArray from 'lodash/isArray'
import promiseBatcher from './promiseBatcher'

const HOOKS_COLLECTION = '$hooks'
const $hooks = $root.scope(HOOKS_COLLECTION)
const WARNING_MESSAGE = "[react-sharedb] Warning. Item couldn't initialize. " +
  'This might be normal if several resubscriptions happened ' +
  'quickly one after another. Error:'

export const useDoc = generateUseItemOfType(subDoc)
export const useBatchDoc = generateUseItemOfType(subDoc, { batch: true })
export const useAsyncDoc = generateUseItemOfType(subDoc, { optional: true })

export const useQuery = generateUseItemOfType(subQuery)
export const useBatchQuery = generateUseItemOfType(subQuery, { batch: true })
export const useAsyncQuery = generateUseItemOfType(subQuery, { optional: true })

export const useApi = generateUseItemOfType(subApi)
export const useBatchApi = generateUseItemOfType(subApi, { batch: true })
export const useAsyncApi = generateUseItemOfType(subApi, { optional: true })

export const useLocal = generateUseItemOfType(subLocal)
export const useValue = generateUseItemOfType(subValue)

function generateUseItemOfType (typeFn, { optional, batch } = {}) {
  let isQuery = typeFn === subQuery
  let takeOriginalModel = typeFn === subDoc || typeFn === subLocal
  let isSync = typeFn === subLocal || typeFn === subValue
  return (...args) => {
    let hookId = useMemo(() => $root.id(), [])
    let hashedArgs = useMemo(() => JSON.stringify(args), args)

    const initsCountRef = useRef(0)
    const cancelInitRef = useRef()
    const itemRef = useRef()
    const destructorsRef = useRef([])

    let destroy = useCallback(() => {
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
      let item = getItemFromParams(params, $hooks, hookId)
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
        let cancelInit = {}
        cancelInitRef.current = cancelInit

        // If there is no previous item, it means we are the first
        let firstItem = !itemRef.current
        // Cancel previous item
        if (itemRef.current) itemRef.current.cancel()
        // and init new
        itemRef.current = item

        // It might or might NOT return the promise, depending on whether
        // we need to wait for the new data
        try {
          let initPromise = item.init(firstItem, { optional, batch })
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

    // ----- data -----

    // In any situation force access data through the object key to let observer know that the data was accessed
    let data = $hooks.get()[hookId]

    // ----- return -----

    return [
      initsCountRef.current
        ? (typeFn === subQuery && isArray(data) ? data.filter(Boolean) : data)
        : undefined,

      // Query, QueryExtra: return scoped model to collection path.
      // Everything else: return the 'hooks.<randomHookId>' scoped model.
      $queryCollection || $model,

      // explicit ready flag
      initsCountRef.current
    ]
  }
}

export function useBatch () {
  let promise = promiseBatcher.getPromiseAll()
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
  let type = params.__subscriptionType
  switch (type) {
    case 'Local':
      return params.params
    case 'Doc':
      return params.params && params.params.join('.')
  }
}

export function getItemFromParams (params, model, key) {
  let explicitType = params && params.__subscriptionType
  let subscriptionParams = params.params
  let constructor = getItemConstructor(explicitType)
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
