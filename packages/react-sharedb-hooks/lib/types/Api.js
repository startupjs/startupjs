import { _observablePath as observablePath } from '@startupjs/react-sharedb-util'
import Base from './Base.js'
import promiseBatcher from '../hooks/promiseBatcher.js'

// track cache paths usage to correctly run destructor only when no other hooks are using the same path
// TODO: simplify this, cache is not actually needed anymore since we are passing signals around
const CACHE_USAGE = {}

export default class Local extends Base {
  constructor (...args) {
    super(...args)
    const [path, fn, inputs, options] = this.params
    this.fn = fn
    this.path = path
    this.inputs = inputs || []
    this.options = options || {}
    if (!this.path) {
      const cacheKey = '_' + hashCode(this.fn.toString() + JSON.stringify(this.inputs))
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
    const { key } = this
    if (this.path) {
      this.model.root.setDiff(this.path, this.data)
      observablePath(this.path)
      this.model.ref(key, this.model.root.scope(this.path))
      CACHE_USAGE[this.path] = (CACHE_USAGE[this.path] || 0) + 1
    } else {
      this.model.setDiff(key, this.data)
    }
  }

  unrefModel () {
    const { key } = this
    if (this.path) {
      this.model.removeRef(key)
      CACHE_USAGE[this.path]--
      if (CACHE_USAGE[this.path] <= 0) this.model.root.del(this.path)
    } else {
      this.model.del(key)
    }
  }

  _fetch (firstItem, { optional, batch } = {}) {
    const promise = this.fn(...this.inputs)
    if (!(promise && typeof promise.then === 'function')) {
      throw new Error('[react-sharedb] Api: fn must return promise')
    }
    if (this.model.get(this.path)) {
      this.data = this.model.get(this.path)
      return
    }

    if (firstItem && !optional) {
      const model = this.model
      const path = this.path
      const newPromise = promise.then(data => {
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
    const char = source.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}
