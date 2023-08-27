/* global */
import { observable, raw } from '@nx-js/observer-util'
import { SEGMENTS, isSignal, getSegmentsFromHash, getSignal } from './signal.js'
import { isRemoteDocDataSegments, isRemoteDocSegments } from './constants.js'
import { subscribeToDocument, unsubscribeFromDocument, getShareDoc } from './docSubscription.js'
// import { getConnection } from './connection.js'

export const IN_PROGRESS = Symbol('subscription in progress')
export const SUBSCRIBED = Symbol('already subscribed')
export const REMOTE_DOC_SIGNAL = Symbol('reference to the remote doc from within its data')
export const MANAGED_BY_SIGNAL = Symbol('this remote doc is managed by a signal logic itself instead of racer')

const rootData = {}
const rootObservable = observable(rootData)

// TODO: Remove! for debugging
window.rootObservable = rootObservable

// let connectionInitialized = false
// function initConnection () {
//   connectionInitialized = true
//   console.log('connection', getConnection())
//   getConnection().on('doc', shareDoc => {
//     const collectionName = shareDoc.collection
//     const docId = shareDoc.id
//     injectRemoteDoc.apply(shareDoc)
//     shareDoc.on('load', injectRemoteDoc)
//     shareDoc.on('create', injectRemoteDoc)
//     shareDoc.on('del', () => ejectRemoteDoc(collectionName, docId))
//     shareDoc.on('destroy', () => ejectRemoteDoc(collectionName, docId))
//   })
// }
// TODO: Better to initConnection() late, but with racer we have to do it very early
// initConnection()
// connectionInitialized = true

// factory function to call different subscribe functions
export function sub$ (...args) {
  // TODO: Better to initConnection() late, but with racer we have to do it very early
  // if (!connectionInitialized) initConnection()
  if (args.length === 1) {
    if (isSignal(args[0])) return subDoc(...args)
  }
  throw ERRORS.sub$(args)
}

// TODO: it should only return `true` when we are inside the observer()
const inReact = () => true

// TODO: inside react component it should always return signal
//       but outside it should always return a promise
function subDoc (signal) {
  const segments = signal[SEGMENTS]
  if (!isRemoteDocSegments(segments)) throw ERRORS.subDoc(segments)
  if (!signal[MANAGED_BY_SIGNAL]) signal[MANAGED_BY_SIGNAL] = true
  if (signal[SUBSCRIBED]) {
    if (inReact()) return signal
    return Promise.resolve(signal)
  }
  if (!signal[IN_PROGRESS]) {
    const [collectionName, docId] = segments
    console.log('> subscribe', collectionName, docId)
    const promise = subscribeToDocument(collectionName, docId).then(() => {
      console.log('> subscribed', collectionName, docId)
      signal[SUBSCRIBED] = true
      console.log('> subscribed 1', collectionName, docId)
      signal[IN_PROGRESS] = undefined
      console.log('> exec initDoc')
      initDoc(collectionName, docId)
    })
    signal[IN_PROGRESS] = promise
  }
  if (inReact()) throw signal[IN_PROGRESS]
  return signal[IN_PROGRESS]
}

export const plugin = { create, destroy, apply }

function apply (target, parent, methodName, argumentsList) {
  if (isRemoteDocDataSegments(parent[SEGMENTS]) && (
    parent[MANAGED_BY_SIGNAL] ||
    parent[REMOTE_DOC_SIGNAL]?.[MANAGED_BY_SIGNAL]
  )) {
    if (methodName === 'get') {
      return retrieve(parent[SEGMENTS])
    } else if (methodName === 'map') {
      const items = retrieve(parent[SEGMENTS])
      const segments = [...parent[SEGMENTS]] // clone to help GC cleanup clojure fns
      return items.map((item, index) => getSignal([...segments, index])).map(...argumentsList)
    }
  }
  this.next()
}

function create (signal, segments, parentProxyTarget) {
  if (isRemoteDocDataSegments(segments)) {
    if (segments.length > 2) {
      signal[REMOTE_DOC_SIGNAL] = parentProxyTarget?.[REMOTE_DOC_SIGNAL] || getSignal(segments.slice(0, 2))
    }
  }
  this.next()
}

function destroy (hash) {
  const segments = getSegmentsFromHash(hash)
  if (isRemoteDocSegments(segments)) {
    const [collectionName, docId] = segments
    destroyDoc(collectionName, docId)
  }
  this.next()
}

function initDoc (collectionName, docId) {
  console.log('> initDoc', collectionName, docId)
  const shareDoc = getShareDoc(collectionName, docId)
  if (shareDoc._signalSubscribed) return
  console.log('> inject data', collectionName, docId)
  shareDoc._signalSubscribed = true // TODO: use Map instead of this flag
  shareDoc.on('create', injectRemoteDoc)
  injectRemoteDoc.apply(shareDoc)
}

function destroyDoc (collectionName, docId) {
  const shareDoc = getShareDoc(collectionName, docId)
  if (!shareDoc._signalSubscribed) return
  shareDoc.off('create', injectRemoteDoc)
  ejectRemoteDoc(collectionName, docId)
  delete shareDoc._signalSubscribed
  unsubscribeFromDocument(collectionName, docId)
}

// `this` must be shareDoc
function injectRemoteDoc () {
  console.log('>> inject', this)
  this.data = observable(this.data)
  if (rootData[this.collection]) {
    rootObservable[this.collection][this.id] = raw(this.data)
  } else {
    rootObservable[this.collection] = { [this.id]: raw(this.data) }
  }
}

function ejectRemoteDoc (collectionName, docId) {
  if (rootData[collectionName]?.[docId]) {
    if (Object.keys(rootData[collectionName]).length === 1) {
      delete rootObservable[collectionName]
    } else {
      delete rootObservable[collectionName][docId]
    }
  }
}

const ERRORS = {
  sub$ (args) {
    return Error('sub$() got unsupported params: ' + JSON.stringify(args))
  },
  subDoc (segments) {
    return Error('sub$() for documents must have 2 segments in path (collection and document id) \n' +
      'and it can not be a local collection (which starts from \'_\' or \'$\').\n' +
      'Received segments: ' + JSON.stringify(segments))
  }
}

function lookup (segments, value) {
  if (!segments) return value

  for (var i = 0, len = segments.length; i < len; i++) {
    if (value == null) return value
    value = value[segments[i]]
  }
  return value
}

export const retrieve = segments => lookup(segments, rootObservable)
export const peek = segments => lookup(segments, rootData)
