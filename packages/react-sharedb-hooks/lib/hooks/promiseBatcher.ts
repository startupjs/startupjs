class PromiseBatcher {
  promises: Promise<any>[]
  active: boolean

  constructor () {
    this.promises = []
    this.active = false
  }

  add (promise: Promise<any>): void {
    this.promises.push(promise)
  }

  activate (): void {
    this.active = true
  }

  isActive (): boolean {
    return this.active
  }

  getPromiseAll (): Promise<any[]> {
    this.active = false
    if (this.promises.length === 0) return
    const promises = [...this.promises]
    this.promises.length = 0
    return Promise.all(promises)
  }

  reset (): void {
    this.promises.length = 0
    this.active = false
  }
}

export default new PromiseBatcher()
