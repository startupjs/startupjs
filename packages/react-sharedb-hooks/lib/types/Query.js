import Base from './Base.js'
import { observable } from '@nx-js/observer-util'
import { _observablePath as observablePath } from '@startupjs/react-sharedb-util'
import $root from '@startupjs/model'
import promiseBatcher from '../hooks/promiseBatcher.js'

const MAX_LISTENERS = 100

export default class Query extends Base {
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

  getData () {
    return this.$$query && this.$$query.get()
  }

  getModelPath () {
    return this.collection
  }

  getModel () {
    return this.$collection
  }

  _subscribe (firstItem, { optional, batch } = {}) {
    const { collection, query } = this
    this.$$query = this.$root.query(collection, query)
    this.$collection = this.$root.scope(collection)
    const promise = this.$root.subscribeSync(this.$$query)

    // if promise wasn't resolved synchronously it means that we have to wait
    // for the subscription to finish, in that case we unsubscribe from the data
    // and throw the promise out to be caught by the wrapping <Suspense>
    if (firstItem && !optional && !promise.sync) {
      const newPromise = promise.then(() => {
        return new Promise(resolve => {
          this._unsubscribe() // unsubscribe the old hook to prevent memory leaks
          setTimeout(resolve, 0)
        })
      }).catch(err => {
        console.error(err)
        $root.emit('error', err)
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
      const path = `$queries.${this.$$query.hash}`
      observablePath(path)

      // observe initial docs
      const docIds = this.$$query.getIds()
      for (const docId of docIds) {
        const shareDoc = this.$root.connection.get(collection, docId)
        shareDoc.data = observable(shareDoc.data)
      }
      // Increase the listeners cap
      this.$$query.shareQuery.setMaxListeners(MAX_LISTENERS)

      // [insert]
      const insertFn = shareDocs => {
        // observe new docs
        const ids = getShareResultsIds(shareDocs)
        ids.forEach(docId => {
          const shareDoc = this.$root.connection.get(collection, docId)
          shareDoc.data = observable(shareDoc.data)
        })
      }
      this.$$query.shareQuery.on('insert', insertFn)
      this.listeners.push({
        ee: this.$$query.shareQuery,
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
    if (!this.$$query) return
    this.$root.unsubscribe(this.$$query)
    // setTimeout(() => {
    //   console.log('>> unsubscribe')
    //   model.unsubscribe(subscription)
    // }, 3000)
    delete this.$collection
    delete this.$$query
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
  const ids = []
  for (let i = 0; i < results.length; i++) {
    const shareDoc = results[i]
    ids.push(shareDoc.id)
  }
  return ids
}
