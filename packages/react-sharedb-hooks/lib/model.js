import Doc from './types/Doc'
import Query from './types/Query'
import QueryExtra from './types/QueryExtra'
import Local from './types/Local'
import Value from './types/Value'
import Api from './types/Api'
import {
  subDoc,
  subLocal,
  subValue,
  subQuery,
  subApi
} from './subscriptionTypeFns'
import co from 'co'

const SUBS_COLLECTION = '$subs'

export default function (racer) {
  racer.Model.prototype.subDoc = generateMethodOfType(subDoc)
  racer.Model.prototype.subQuery = generateMethodOfType(subQuery)
  racer.Model.prototype.subLocal = generateMethodOfType(subLocal)
  racer.Model.prototype.subValue = generateMethodOfType(subValue)
  racer.Model.prototype.subApi = generateMethodOfType(subApi)
}

function generateMethodOfType (typeFn) {
  const isQuery = typeFn === subQuery
  const isSync = typeFn === subLocal || typeFn === subValue
  const takeOriginalModel = typeFn === subDoc || typeFn === subLocal

  // IMPORTANT: subLocal, subValue can actually be made to be synchronous,
  //            but for consistency of the sub* functions api, the decision was made
  //            to always return a promise
  return co.wrap(function * (...args) {
    const $subs = this.scope(SUBS_COLLECTION)
    const subId = this.id()
    const params = typeFn(...args)
    const item = getItemFromParams(params, $subs, subId)
    const unsubscribe = () => {
      item.unrefModel()
      item.destroy()
      $subs.destroy(subId)
    }
    if (!isSync) yield item.init(true, { optional: true })
    item.refModel()

    // For Query and QueryExtra return the scoped model targeting the actual collection path.
    // This is much more useful since you can use that use this returned model
    // to update items with: $queryCollection.at(itemId).set('title', 'FooBar')
    const collectionName = isQuery ? getCollectionName(params) : undefined
    const $queryCollection = isQuery ? this.scope(collectionName) : undefined

    // For Doc, Local, Value return the model scoped to the hook path
    // But only after the initialization actually finished, otherwise
    // the ORM won't be able to properly resolve the path which was not referenced yet
    const $model = (() => {
      if (isQuery) return
      if (takeOriginalModel) {
        return this.scope(getPath(params))
      } else {
        return $subs.at(subId)
      }
    })()

    // In any situation force access data through the object key to let observer know that the data was accessed
    const data = $subs.get()[subId]

    return [
      unsubscribe,

      data,

      // Query, QueryExtra: return scoped model to collection path.
      // Everything else: return the 'hooks.<randomHookId>' scoped model.
      $queryCollection || $model
    ]
  })
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

export function getCollectionName (params) {
  return params && params.params && params.params[0]
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
