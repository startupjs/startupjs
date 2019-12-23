import Base from './Base'
import { observablePath } from '../util'
import promiseBatcher from '../hooks/promiseBatcher'

export default class Local extends Base {
  constructor (...args) {
    super(...args)
    let [path, fn, inputs, options] = this.params
    this.fn = fn
    this.path = path
    this.inputs = inputs || []
    this.options = options || {}
    if (!this.path) {
      let cacheKey = '_' + hashCode(this.fn.toString() + JSON.stringify(this.inputs))
      this.path = '_session._cache.' + cacheKey
    }
    this.listeners = []
  }

  init (firstItem, { optional, batch } = {}) {
    if (this.options.debounce && !firstItem) {
      return new Promise(resolve => {
        setTimeout(resolve, this.options.debounce)
      }).then(() => {
        if (this.cancelled) return
        return this._fetch()
      })
    }
    return this._fetch(firstItem, { optional, batch })
  }

  refModel () {
    if (this.cancelled) return
    let { key } = this
    if (this.path) {
      this.model.root.setDiff(this.path, this.data)
      observablePath(this.path)
      this.model.ref(key, this.model.root.scope(this.path))
    } else {
      this.model.setDiff(key, this.data)
    }
  }

  unrefModel () {
    let { key } = this
    if (this.path) {
      this.model.removeRef(key)
      this.model.root.del(this.path)
    } else {
      this.model.del(key)
    }
  }

  _fetch (firstItem, { optional, batch } = {}) {
    let promise = this.fn(...this.inputs)
    if (!(promise && typeof promise.then === 'function')) {
      throw new Error('[react-sharedb] Api: fn must return promise')
    }
    if (this.model.get(this.path)) {
      this.data = this.model.get(this.path)
      return
    }

    if (firstItem && !optional) {
      let model = this.model
      let path = this.path
      let newPromise = promise.then(data => {
        model.set(path, data)
      })
      if (batch) {
        promiseBatcher.add(newPromise)
        return { type: 'batch' }
      } else {
        throw newPromise
      }
    } else {
      return promise.then(data => {
        if (this.cancelled) return
        this.data = data
        this.model.set(this.path, data)
      })
    }
  }

  destroy () {
    // this.unrefModel() // TODO: Maybe enable unref in future
    delete this.path
    delete this.fn
    delete this.inputs
    delete this.options
    delete this.data
    super.destroy()
  }
}

function hashCode (source) {
  let hash = 0
  if (source.length === 0) return hash
  for (var i = 0; i < source.length; i++) {
    let char = source.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}
