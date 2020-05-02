const Base = require('./Base')
const { observable } = require('@nx-js/observer-util')
const { _observablePath: observablePath } = require('@startupjs/react-sharedb-util')

const MAX_LISTENERS = 100

module.exports = exports = class Query extends Base {
  constructor (...args) {
    super(...args)
    const [collection, query] = this.params
    this.collection = collection
    this.query = query
    this.listeners = []
  }

  init (firstItem, { optional, batch } = {}) {
    return this._subscribe(firstItem, { optional, batch })
  }

  refModel () {
    if (this.cancelled) return
    const { key } = this
    this.subscription.ref(this.model.at(key))
    observablePath(this.model.path(key))
    this.subscription.refIds(this.model.at(exports.getIdsName(key)))
  }

  unrefModel () {
    const { key } = this
    this.model.removeRef(exports.getIdsName(key))
    this.model.removeRef(key)
  }

  _subscribe (firstItem, { optional, batch } = {}) {
    const { collection, query } = this
    this.subscription = this.model.root.query(collection, query)
    const promise = this.model.root.subscribeSync(this.subscription)

    // if promise wasn't resolved synchronously it means that we have to wait
    // for the subscription to finish, in that case we unsubscribe from the data
    // and throw the promise out to be caught by the wrapping <Suspense>
    if (firstItem && !optional && !promise.sync) {
      const newPromise = promise.then(() => {
        return new Promise(resolve => {
          this._unsubscribe() // unsubscribe the old hook to prevent memory leaks
          setTimeout(resolve, 0)
        })
      })
      throw newPromise
    }

    const finish = () => {
      if (this.cancelled) return
      // TODO: if (err) return reject(err)
      // observe ids and extra
      const path = `$queries.${this.subscription.hash}`
      observablePath(path)

      // observe initial docs
      const docIds = this.subscription.getIds()
      for (const docId of docIds) {
        const shareDoc = this.model.root.connection.get(collection, docId)
        shareDoc.data = observable(shareDoc.data)
      }
      // Increase the listeners cap
      this.subscription.shareQuery.setMaxListeners(MAX_LISTENERS)

      // [insert]
      const insertFn = shareDocs => {
        // observe new docs
        const ids = exports.getShareResultsIds(shareDocs)
        ids.forEach(docId => {
          const shareDoc = this.model.root.connection.get(collection, docId)
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
    for (const listener of this.listeners || []) {
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

exports.getIdsName = function getIdsName (plural) {
  if (/ies$/i.test(plural)) return plural.replace(/ies$/i, 'y') + 'Ids'
  return plural.replace(/s$/i, '') + 'Ids'
}

exports.getShareResultsIds = function getShareResultsIds (results) {
  const ids = []
  for (let i = 0; i < results.length; i++) {
    const shareDoc = results[i]
    ids.push(shareDoc.id)
  }
  return ids
}
