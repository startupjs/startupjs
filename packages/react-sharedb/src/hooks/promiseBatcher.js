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
    this.active = false
    if (this.promises.length === 0) return
    const promises = [...this.promises]
    this.promises.length = 0
    return Promise.all(promises)
  }

  reset () {
    this.promises.length = 0
    this.active = false
  }
}

export default new PromiseBatcher()
