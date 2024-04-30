export default class Cache {
  constructor () {
    this.cache = new Map()
    this.fr = new FinalizationRegistry(([key]) => this.delete(key))
  }

  get (key) {
    return this.cache.get(key)?.deref()
  }

  /**
   * @param {string} key
   * @param {*} value
   * @param {Array} inputs - extra inputs to register with the finalization registry
   *                         to hold strong references to them until the value is garbage collected
   */
  set (key, value, inputs = []) {
    this.cache.set(key, new WeakRef(value))
    this.fr.register(value, [key, ...inputs])
  }

  delete (key) {
    this.cache.delete(key)
  }

  get size () {
    return this.cache.size
  }
}
