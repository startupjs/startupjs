import Signal, { isPublicCollectionSignal, isPublicDocumentSignal } from './Signal.js'
import { docSubscriptions } from './Doc.js'

export default async function sub$ ($signal, params) {
  if (isPublicDocumentSignal($signal)) {
    return doc$($signal)
  } else if (isPublicCollectionSignal($signal)) {
    return query$($signal, params)
  } else if (typeof $signal === 'function' && !($signal instanceof Signal)) {
    return api$($signal, params)
  } else {
    throw Error('Invalid args passed for sub$()')
  }
}

async function doc$ ($doc) {
  await docSubscriptions.subscribe($doc)
  return $doc
}

function query$ ($collection, params) {

}

function api$ (fn, args) {

}
