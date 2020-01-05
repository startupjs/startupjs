class PromiseBatcher {
  constructor () {
    this.promises = []
    this.active = false
  }

  add (promise) {
    this.promises.push(promise)
  }

  activate () {
    this.active = true
  }

  isActive () {
    return this.active
  }

  getPromiseAll () {
    const promises = [...this.promises]
    this.reset()
    if (promises.length === 0) return
    return Promise.all(promises)
  }

  reset () {
    this.promises.length = 0
    this.active = false
  }
}

export default new PromiseBatcher()
