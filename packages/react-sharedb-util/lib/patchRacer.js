import racer from 'racer'
import RacerLocalDoc from 'racer/lib/Model/LocalDoc.js'
import RacerRemoteDoc from 'racer/lib/Model/RemoteDoc.js'
import RacerUtil from 'racer/lib/util.js'
import RacerQuery from 'racer/lib/Model/Query.js'
import SharedbDoc from 'sharedb/lib/client/doc.js'
import { observable, isObservable } from '@nx-js/observer-util'
import batching from '../batching.js'
import semaphore from './semaphore.js'

const STORE = 'store'
const $STORE = '$' + STORE
const DEFAULT_COLLECTION = '$components'

const BATCH_SETTERS = ['_mutate', '_setEach', '_setDiff', '_setDiffDeep']
const WARNING_SETTERS = ['_set', '_setDiff', '_setNull', '_del']

// Export a dummy function to prevent tree shaking from getting rid of this module
export default function dummyNoTreeShaking () {}

// ----------------------------------------------
//   Monkey patches of ShareDB and Racer
// ----------------------------------------------

// Patch applying sharedb operations to prevent extra rerender from triggering
const oldHandleOp = SharedbDoc.prototype._handleOp
SharedbDoc.prototype._handleOp = function () {
  let value
  batching.batch(() => {
    value = oldHandleOp.apply(this, arguments)
  })
  return value
}

// Patch racer setters to batch them from extra rerenders
for (const methodName of BATCH_SETTERS) {
  const oldMethod = racer.Model.prototype[methodName]
  racer.Model.prototype[methodName] = function () {
    let value
    batching.batch(() => {
      // TODO: temporary hack, investigate '_setEach'
      // (this is happenning because of a '$root.setEach('_session', ...)') in
      // app/client/index.js -> initServerSession
      if (methodName === '_setEach') {
        semaphore.ignoreCollectionObservableWarning = true
      }
      value = oldMethod.apply(this, arguments)
      if (methodName === '_setEach') {
        semaphore.ignoreCollectionObservableWarning = false
      }
    })
    return value
  }
}

// Warn when trying to set the full document instead of doing setEach
for (const methodName of WARNING_SETTERS) {
  const oldMethod = racer.Model.prototype[methodName]
  racer.Model.prototype[methodName] = function (segments) {
    if (
      segments.length === 2 &&
      segments[0] === DEFAULT_COLLECTION &&
      !semaphore.allowComponentSetter
    ) {
      throw new Error(
        `You can't use '${methodName.replace(/^_/, '')}' on component's ` +
          `${$STORE} root path. Use 'setEach' instead.`
      )
    }
    return oldMethod.apply(this, arguments)
  }
}

// Monkey patch racer's local documents to be observable
const oldUpdateCollectionData = RacerLocalDoc.prototype._updateCollectionData
RacerLocalDoc.prototype._updateCollectionData = function () {
  // Only objects and arrays can be made observable (both are typeof 'object')
  if (this.data && typeof this.data === 'object') {
    this.data = observable(this.data)
  }
  if (
    !semaphore.ignoreCollectionObservableWarning &&
    !isObservable(this.collectionData) &&
    this.collectionName !== '$connection'
  ) {
    console.warn(
      `[react-sharedb] Local collection "${this
        .collectionName}" is not initialized to be observable. ` +
        `Run require("react-sharedb").initLocalCollection("${this
          .collectionName}") before using it anywhere. ` +
        `You must also do it right after cleaning it up with model.silent().destroy("${this
          .collectionName}")`
    )
  }
  return oldUpdateCollectionData.apply(this, arguments)
}

// Monkey patch racer remote doc to make document observable when it's created locally
const oldRemoteDocUpdateCollectionData = RacerRemoteDoc.prototype._updateCollectionData
RacerRemoteDoc.prototype._updateCollectionData = function () {
  if (this.shareDoc.data) this.shareDoc.data = observable(this.shareDoc.data)
  return oldRemoteDocUpdateCollectionData.apply(this, arguments)
}

// Add additional `sync` variant of fetch, which will sync return data if it already exists in cache
racer.Model.prototype.fetchSync = function () {
  let _resolve
  const promise = new Promise(function (resolve) { _resolve = resolve })
  this._forSubscribable(arguments, 'fetch', _resolve, promise)
  return promise
}

// Add additional `sync` variant of subscribe, which will sync return data if it already exists in cache
racer.Model.prototype.subscribeSync = function () {
  let _resolve
  let _reject
  const promise = new Promise(function (resolve, reject) {
    _resolve = resolve
    _reject = reject
  })
  this._forSubscribable(arguments, 'subscribe', _resolve, promise, _reject)
  return promise
}

// resolve is used for SYNC mode.
// In this mode the subscribeSync function returns a promise
// which is gonna be either:
//   - resolved, if we are already subscribed to all data (it's in racer model)
//   - pending, if at least one subscription needs to be executed
racer.Model.prototype._forSubscribable = function (argumentsObject, method, resolve, promise, reject) {
  let args, cb
  if (!argumentsObject.length) {
    // Use this model's scope if no arguments
    args = [null]
  } else if (typeof argumentsObject[0] === 'function') {
    // Use this model's scope if the first argument is a callback
    args = [null]
    cb = argumentsObject[0]
  } else if (Array.isArray(argumentsObject[0])) {
    // Items can be passed in as an array
    args = argumentsObject[0]
    cb = argumentsObject[1]
  } else {
    // Or as multiple arguments
    args = Array.prototype.slice.call(argumentsObject)
    const last = args[args.length - 1]
    if (typeof last === 'function') cb = args.pop()
  }

  // [SYNC MODE] For sync usage of subscribe
  if (resolve) {
    cb = function (err) {
      if (err) return reject(err)
      promise.sync = true
      resolve()
    }
  }

  const group = RacerUtil.asyncGroup(this.wrapCallback(cb))
  const finished = group()
  const docMethod = method + 'Doc'

  this.root.connection.startBulk()
  for (let i = 0; i < args.length; i++) {
    const item = args[i]
    if (item instanceof RacerQuery) {
      item[method](group())
    } else {
      const segments = this._dereference(this._splitPath(item))
      if (segments.length === 2) {
        // Do the appropriate method for a single document.
        this[docMethod](segments[0], segments[1], group())
      } else {
        const message = 'Cannot ' + method + ' to path: ' + segments.join('.')
        group()(new Error(message))
      }
    }
  }
  this.root.connection.endBulk()

  // [SYNC MODE] Don't force async execution if we are in sync mode
  if (resolve) return finished()

  process.nextTick(finished)
}

// Monkey patch query subscribe to return data synchronously if it's in cache
RacerQuery.prototype.subscribe = function (cb) {
  cb = this.model.wrapCallback(cb)
  this.model._context.subscribeQuery(this)

  if (this.subscribeCount++) {
    var query = this
    // Synchronously return data if it's already in cache
    // process.nextTick(function() {
    var data = query.model._get(query.segments)
    if (data) {
      cb()
    } else {
      query._pendingSubscribeCallbacks.push(cb)
    }
    // })
    return this
  }

  if (!this.created) this.create()

  const options = (this.options) ? RacerUtil.copy(this.options) : {}
  options.results = this._getShareResults()

  // When doing server-side rendering, we actually do a fetch the first time
  // that subscribe is called, but keep track of the state as if subscribe
  // were called for proper initialization in the client
  if (this.model.root.fetchOnly) {
    this._shareFetchedSubscribe(options, cb)
  } else {
    this._shareSubscribe(options, cb)
  }

  return this
}
