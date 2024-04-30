export default class Cache {
  constructor () {
    this.cache = new Map()
    this.fr = new FinalizationRegistry((...args) => this.delete(...args))
  }

  get (key) {
    return this.cache.get(key)?.deref()
  }

  set (key, value) {
    this.cache.set(key, new WeakRef(value))
    this.fr.register(value, key)
  }

  delete (key) {
    this.cache.delete(key)
  }

  get size () {
    return this.cache.size
  }
}
