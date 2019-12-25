import Base from './Base'
import { observable } from '@nx-js/observer-util'
import { observablePath } from '../util'
import promiseBatcher from '../hooks/promiseBatcher'

const MAX_LISTENERS = 100

export default class Query extends Base {
  constructor (...args) {
    super(...args)
    let [collection, query] = this.params
    this.collection = collection
    this.query = query
    this.listeners = []
  }

  init (firstItem, { optional, batch } = {}) {
    return this._subscribe(firstItem, { optional, batch })
  }

  refModel () {
    if (this.cancelled) return
    let { key } = this
    this.subscription.ref(this.model.at(key))
    observablePath(this.model.path(key))
    this.subscription.refIds(this.model.at(getIdsName(key)))
  }

  unrefModel () {
    let { key } = this
    this.model.removeRef(getIdsName(key))
    this.model.removeRef(key)
  }

  _subscribe (firstItem, { optional, batch } = {}) {
    let { collection, query } = this
    this.subscription = this.model.root.query(collection, query)
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
      // observe ids and extra
      let path = `$queries.${this.subscription.hash}`
      observablePath(path)

      // observe initial docs
      let docIds = this.subscription.getIds()
      for (let docId of docIds) {
        let shareDoc = this.model.root.connection.get(collection, docId)
        shareDoc.data = observable(shareDoc.data)
      }
      // Increase the listeners cap
      this.subscription.shareQuery.setMaxListeners(MAX_LISTENERS)

      // [insert]
      let insertFn = shareDocs => {
        // observe new docs
        let ids = getShareResultsIds(shareDocs)
        ids.forEach(docId => {
          let shareDoc = this.model.root.connection.get(collection, docId)
          shareDoc.data = observable(shareDoc.data)
        })
      }
      this.subscription.shareQuery.on('insert', insertFn)
      this.listeners.push({
        ee: this.subscription.shareQuery,
        eventName: 'insert',
        fn: insertFn
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
    // setTimeout(() => {
    //   console.log('>> unsubscribe')
    //   model.unsubscribe(subscription)
    // }, 3000)
    delete this.subscription
  }

  destroy () {
    try {
      this._clearListeners()
      // this.unrefModel() // TODO: Maybe enable unref in future
      // TODO: Test what happens when trying to unsubscribe from not yet subscribed
      this._unsubscribe()
    } catch (err) {}
    delete this.query
    delete this.collection
    super.destroy()
  }
}

export function getIdsName (plural) {
  if (/ies$/i.test(plural)) return plural.replace(/ies$/i, 'y') + 'Ids'
  return plural.replace(/s$/i, '') + 'Ids'
}

export function getShareResultsIds (results) {
  let ids = []
  for (let i = 0; i < results.length; i++) {
    let shareDoc = results[i]
    ids.push(shareDoc.id)
  }
  return ids
}
