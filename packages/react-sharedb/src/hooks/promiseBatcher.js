class PromiseBatcher {
  constructor () {
    this.promises = []
  }

  add (promise) {
    this.promises.push(promise)
  }

  getPromiseAll () {
    if (this.promises.length === 0) return
    let promises = [...this.promises]
    this.promises.length = 0
    return Promise.all(promises)
  }

  reset () {
    this.promises.length = 0
  }
}

export default new PromiseBatcher()
