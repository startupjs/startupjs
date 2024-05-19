import { isObservable, observable } from '@nx-js/observer-util'
import { set as _set, del as _del } from './dataTree.js'
import { SEGMENTS } from './Signal.js'
import { getConnection, fetchOnly } from './connection.js'

const ERROR_ON_EXCESSIVE_UNSUBSCRIBES = false

class Doc {
  subscribing
  unsubscribing
  subscribed
  initialized

  constructor (collection, docId) {
    this.collection = collection
    this.docId = docId
    this.init()
  }

  init () {
    if (this.initialized) return
    this.initialized = true
    this._initData()
  }

  async subscribe () {
    if (this.subscribed) throw Error('trying to subscribe while already subscribed')
    this.subscribed = true
    // if we are in the middle of unsubscribing, just wait for it to finish and then resubscribe
    if (this.unsubscribing) {
      try {
        await this.unsubscribing
      } catch (err) {
        // if error happened during unsubscribing, it means that we are still subscribed
        // so we don't need to do anything
        return
      }
    }
    if (this.subscribing) {
      try {
        await this.subscribing
        // if we are already subscribing from the previous time, delegate logic to that
        // and if it finished successfully, we are done.
        return
      } catch (err) {
        // if error happened during subscribing, we'll just try subscribing again
        // so we just ignore the error and proceed with subscribing
        this.subscribed = true
      }
    }

    if (!this.subscribed) return // cancel if we initiated unsubscribe while waiting

    this.subscribing = (async () => {
      try {
        this.subscribing = this._subscribe()
        await this.subscribing
        this.init()
      } catch (err) {
        console.log('subscription error', [this.collection, this.docId], err)
        this.subscribed = undefined
        throw err
      } finally {
        this.subscribing = undefined
      }
    })()
    await this.subscribing
  }

  async _subscribe () {
    const doc = getConnection().get(this.collection, this.docId)
    await new Promise((resolve, reject) => {
      const method = fetchOnly ? 'fetch' : 'subscribe'
      doc[method](err => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  async unsubscribe () {
    if (!this.subscribed) throw Error('trying to unsubscribe while not subscribed')
    this.subscribed = undefined
    // if we are still handling the subscription, just wait for it to finish and then unsubscribe
    if (this.subscribing) {
      try {
        await this.subscribing
      } catch (err) {
        // if error happened during subscribing, it means that we are still unsubscribed
        // so we don't need to do anything
        return
      }
    }
    // if we are already unsubscribing from the previous time, delegate logic to that
    if (this.unsubscribing) {
      try {
        await this.unsubscribing
        return
      } catch (err) {
        // if error happened during unsubscribing, we'll just try unsubscribing again
        this.subscribed = undefined
      }
    }

    if (this.subscribed) return // cancel if we initiated subscribe while waiting

    this.unsubscribing = (async () => {
      try {
        await this._unsubscribe()
        this.initialized = undefined
        this._removeData()
      } catch (err) {
        console.log('error unsubscribing', [this.collection, this.docId], err)
        this.subscribed = true
        throw err
      } finally {
        this.unsubscribing = undefined
      }
    })()
    await this.unsubscribing
  }

  async _unsubscribe () {
    const doc = getConnection().get(this.collection, this.docId)
    await new Promise((resolve, reject) => {
      doc.destroy(err => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  _initData () {
    const doc = getConnection().get(this.collection, this.docId)
    // TODO: JSON does not have `undefined`, so we'll be receiving `null`.
    //       Handle this by converting all `null` to `undefined` in the doc's data tree.
    //       To do this we'll probably need to in the `op` event update the data tree
    //       and have a clone of the doc in our local data tree.
    this._refData()
    doc.on('load', () => this._refData())
    doc.on('create', () => this._refData())
    doc.on('del', () => _del([this.collection, this.docId]))
  }

  _refData () {
    const doc = getConnection().get(this.collection, this.docId)
    if (isObservable(doc.data)) return
    if (doc.data == null) return
    _set([this.collection, this.docId], doc.data)
    doc.data = observable(doc.data)
  }

  _removeData () {
    _del([this.collection, this.docId])
  }
}

class DocSubscriptions {
  constructor () {
    this.subCount = new Map()
    this.docs = new Map()
    this.initialized = new Map()
    this.fr = new FinalizationRegistry(segments => this.destroy(segments))
  }

  init ($doc) {
    const segments = [...$doc[SEGMENTS]]
    const hash = hashDoc(segments)
    if (this.initialized.has(hash)) return
    this.initialized.set(hash, true)

    this.fr.register($doc, segments, $doc)

    let doc = this.docs.get(hash)
    if (!doc) {
      doc = new Doc(...segments)
      this.docs.set(hash, doc)
    }
    doc.init()
  }

  subscribe ($doc) {
    const segments = [...$doc[SEGMENTS]]
    const hash = hashDoc(segments)
    let count = this.subCount.get(hash) || 0
    count += 1
    this.subCount.set(hash, count)
    if (count > 1) return this.docs.get(hash).subscribing

    this.init($doc)
    const doc = this.docs.get(hash)
    return doc.subscribe()
  }

  async unsubscribe ($doc) {
    const segments = [...$doc[SEGMENTS]]
    const hash = hashDoc(segments)
    let count = this.subCount.get(hash) || 0
    count -= 1
    if (count < 0) {
      if (ERROR_ON_EXCESSIVE_UNSUBSCRIBES) throw ERRORS.notSubscribed($doc)
      return
    }
    if (count > 0) {
      this.subCount.set(hash, count)
      return
    }
    this.fr.unregister($doc)
    this.destroy(segments)
  }

  async destroy (segments) {
    const hash = hashDoc(segments)
    const doc = this.docs.get(hash)
    if (!doc) return
    this.subCount.delete(hash)
    this.initialized.delete(hash)
    await doc.unsubscribe()
    if (doc.subscribed) return // if we subscribed again while waiting for unsubscribe, we don't delete the doc
    this.docs.delete(hash)
  }
}

export const docSubscriptions = new DocSubscriptions()

function hashDoc (segments) {
  return JSON.stringify(segments)
}

const ERRORS = {
  notSubscribed: $doc => Error('trying to unsubscribe when not subscribed. Doc: ' + $doc.path())
}
