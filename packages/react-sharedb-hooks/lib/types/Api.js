import Base from './Base.js'
import { _observablePath as observablePath } from '@startupjs/react-sharedb-util'
import promiseBatcher from '../hooks/promiseBatcher.js'

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

  getData () {
    return this.$root.get(this.path)
  }

  getModelPath () {
    return this.path
  }

  getModel () {
    return this.$root.scope(this.path)
  }

  refModel () {
    if (this.cancelled) return
    this.$root.setDiff(this.path, this.data)
    observablePath(this.path)
  }

  unrefModel () {
    this.$root.del(this.path)
  }

  _fetch (firstItem, { optional, batch } = {}) {
    const promise = this.fn(...this.inputs)
    if (!(promise && typeof promise.then === 'function')) {
      throw new Error('[react-sharedb] Api: fn must return promise')
    }
    if (this.$root.get(this.path)) {
      this.data = this.$root.get(this.path)
      return
    }

    if (firstItem && !optional) {
      const $root = this.$root
      const path = this.path
      const newPromise = promise.then(data => {
        $root.set(path, data)
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
        this.$root.set(this.path, data)
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
