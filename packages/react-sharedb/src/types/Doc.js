import Base from './Base'
import { observable } from '@nx-js/observer-util'
import promiseBatcher from '../hooks/promiseBatcher'

export default class Doc extends Base {
  constructor (...args) {
    super(...args)
    let [collection, docId] = this.params
    this.collection = collection
    this.docId = docId
    this.listeners = []
  }

  init (firstItem, { optional, batch } = {}) {
    return this._subscribe(firstItem, { optional, batch })
  }

  refModel () {
    if (this.cancelled) return
    let { key } = this
    this.model.ref(key, this.subscription)
  }

  unrefModel () {
    let { key } = this
    this.model.removeRef(key)
  }

  _subscribe (firstItem, { optional, batch } = {}) {
    let { collection, docId } = this
    this.subscription = this.model.root.scope(`${collection}.${docId}`)
    let promise = this.model.root.subscribeSync(this.subscription)

    // if promise wasn't resolved synchronously it means that we have to wait
    // for the subscription to finish, in that case we unsubscribe from the data
    // and throw the promise out to be caught by the wrapping <Suspense>
    if (firstItem && !optional && !promise.sync) {
      let newPromise = promise.then(() => {
        return new Promise(resolve => {
          this._unsubscribe() // unsubscribe the old hook to prevent memory leaks
          setTimeout(resolve, 0)
        })
      })
      if (batch) {
        promiseBatcher.add(newPromise)
        return { type: 'batch' }
      } else {
        throw newPromise
      }
    }

    const finish = () => {
      if (this.cancelled) return
      // TODO: if (err) return reject(err)
      let shareDoc = this.model.root.connection.get(collection, docId)
      shareDoc.data = observable(shareDoc.data)

      // Listen for doc creation, intercept it and make observable
      let createFn = () => {
        let shareDoc = this.model.root.connection.get(collection, docId)
        shareDoc.data = observable(shareDoc.data)
      }
      // Add listener to the top of the queue, since we want
      // to modify shareDoc.data before racer gets to it
      prependListener(shareDoc, 'create', createFn)
      this.listeners.push({
        ee: shareDoc,
        eventName: 'create',
        fn: createFn
      })
    }

    if (promise.sync) {
      finish()
    } else {
      return promise.then(finish)
    }
  }

  _clearListeners () {
    // remove query listeners
    for (let listener of this.listeners || []) {
      listener.ee.removeListener(listener.eventName, listener.fn)
      delete listener.ee
      delete listener.fn
    }
    delete this.listeners
  }

  _unsubscribe () {
    if (!this.subscription) return
    this.model.root.unsubscribe(this.subscription)
    delete this.subscription
  }

  destroy () {
    try {
      this._clearListeners()
      // this.unrefModel() // TODO: Maybe enable unref in future
      // TODO: Test what happens when trying to unsubscribe from not yet subscribed
      this._unsubscribe()
    } catch (err) {}
    delete this.docId
    delete this.collection
    super.destroy()
  }
}

// Shim for EventEmitter.prependListener.
// Right now this is required to support older build environments
// like react-native and webpack v1.
// TODO: Replace this with EventEmitter.prependListener in future
function prependListener (emitter, event, listener) {
  let old = emitter.listeners(event) || []
  emitter.removeAllListeners(event)
  let rv = emitter.on(event, listener)
  for (let i = 0, len = old.length; i < len; i++) {
    emitter.on(event, old[i])
  }
  return rv
}
