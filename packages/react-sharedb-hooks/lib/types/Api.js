import Base from './Base'
import { _observablePath as observablePath } from '@startupjs/react-sharedb-util'
import promiseBatcher from '../hooks/promiseBatcher'

const CLEAR_CACHE_TIMEOUT = 3000
const references = {}

function retainReference (path) {
  if (references[path] == null) references[path] = 0
  console.log('>>> retain', path)
  ++references[path]
}

function releaseReference ($root, path) {
  if (!references[path]) return
  console.log('>>> release', references[path], path)
  --references[path]
  setTimeout(() => {
    console.log('>>> try to destroy after release', references[path], path)
    if (references[path] === 0) {
      console.log('>>> destroy after release', path)
      delete references[path]
      $root.del(path)
    }
  }, CLEAR_CACHE_TIMEOUT)
}

export default class Local extends Base {
  constructor (...args) {
    super(...args)
    const [path, fn, inputs, options] = this.params
    this.fn = fn
    this.path = path
    this.inputs = inputs || []
    this.options = options || {}
    if (!this.path) {
      this.cacheKey = '_' + hashCode(this.fn.toString() + JSON.stringify(this.inputs))
      this.path = '_session._cache.useApi.' + this.cacheKey
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
    retainReference(this.path)
    this.retained = true
    this.model.root.setDiffDeep(this.path, this.data)
    observablePath(this.path)
    this.model.ref(key, this.model.root.scope(this.path))
  }

  unrefModel () {
    console.log('> unref')
    const { key } = this
    this.model.removeRef(key)
    if (this.retained) {
      releaseReference(this.model.root, this.path)
      delete this.retained
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
        model.setDiffDeep(path, data)
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
        this.model.setDiffDeep(this.path, data)
      })
    }
  }

  destroy () {
    console.log('> destroy')
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
