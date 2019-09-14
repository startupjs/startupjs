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

const SUBS_COLLECTION = '$subs'

export default function (racer) {
  racer.Model.prototype.subDoc = generateMethodOfType(subDoc)
  racer.Model.prototype.subQuery = generateMethodOfType(subQuery)
  racer.Model.prototype.subLocal = generateMethodOfType(subLocal)
  racer.Model.prototype.subValue = generateMethodOfType(subValue)
  racer.Model.prototype.subApi = generateMethodOfType(subApi)
}

function generateMethodOfType (typeFn) {
  let isQuery = typeFn === subQuery
  let isSync = typeFn === subLocal || typeFn === subValue
  return async (...args) => {
    let $subs = this.scope(SUBS_COLLECTION)
    let subId = this.id()
    let params = typeFn(...args)
    let item = getItemFromParams(params, $subs, subId)
    const unsubscribe = () => {
      item.unrefModel()
      item.destroy()
      $subs.destroy(subId)
    }
    if (!isSync) await item.init(true)
    item.refModel()

    // For Query and QueryExtra return the scoped model targeting the actual collection path.
    // This is much more useful since you can use that use this returned model
    // to update items with: $queryCollection.at(itemId).set('title', 'FooBar')
    const collectionName = isQuery ? getCollectionName(params) : undefined
    const $queryCollection = isQuery ? this.scope(collectionName) : undefined

    // For Doc, Local, Value return the model scoped to the hook path
    // But only after the initialization actually finished, otherwise
    // the ORM won't be able to properly resolve the path which was not referenced yet
    const $model = !isQuery ? $subs.at(subId) : undefined

    // In any situation force access data through the object key to let observer know that the data was accessed
    let data = $subs.get()[subId]

    return [
      unsubscribe,

      data,

      // Query, QueryExtra: return scoped model to collection path.
      // Everything else: return the 'hooks.<randomHookId>' scoped model.
      $queryCollection || $model
    ]
  }
}

export function getCollectionName (params) {
  return params && params.params && params.params[0]
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
