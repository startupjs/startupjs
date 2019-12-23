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
    if (this.promises.length === 0) return
    let promises = [...this.promises]
    this.reset()
    return Promise.all(promises)
  }

  reset () {
    this.promises.length = 0
    this.active = false
  }
}

export default new PromiseBatcher()
