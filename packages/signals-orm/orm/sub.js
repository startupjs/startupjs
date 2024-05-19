import Signal, { SEGMENTS, isPublicCollectionSignal, isPublicDocumentSignal } from './Signal.js'
import { docSubscriptions } from './Doc.js'
import { querySubscriptions, getQuerySignal } from './Query.js'

export default function sub ($signal, params) {
  if (isPublicDocumentSignal($signal)) {
    return doc$($signal)
  } else if (isPublicCollectionSignal($signal)) {
    return query$($signal, params)
  } else if (typeof $signal === 'function' && !($signal instanceof Signal)) {
    return api$($signal, params)
  } else {
    throw Error('Invalid args passed for sub()')
  }
}

function doc$ ($doc) {
  const promise = docSubscriptions.subscribe($doc)
  if (!promise) return $doc
  return new Promise(resolve => promise.then(() => resolve($doc)))
}

function query$ ($collection, params) {
  const $query = getQuerySignal($collection[SEGMENTS], params)
  const promise = querySubscriptions.subscribe($query)
  if (!promise) return $query
  return new Promise(resolve => promise.then(() => resolve($query)))
}

function api$ (fn, args) {
  throw Error('sub() for async functions is not implemented yet')
}
