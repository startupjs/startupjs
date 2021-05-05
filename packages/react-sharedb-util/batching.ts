// Synchronous batching of functions execution
// Requires ES6 Set

class Batching {
  active: boolean
  queue: Set<any>
  flushActive: boolean

  constructor () {
    this.active = false
    this.queue = new Set()
    this.flushActive = false
  }

  batch (fn: Function): void {
    if (this.active) return fn()
    this.active = true
    fn()
    this.flush()
    this.active = false
  }

  flush (): void {
    if (this.flushActive) return
    this.flushActive = true
    while (true) {
      if (this.queue.size === 0) break
      const fn = getFirstItem(this.queue)
      this.queue.delete(fn)
      fn()
    }
    this.flushActive = false
  }

  add (fn: Function): void {
    if (!this.active) return fn()
    this.queue.add(fn)
  }
}

function getFirstItem (set: any): any {
  let first
  if (set.values) {
    const it = set.values()
    first = it.next()
    return first.value
    // Shim for IE
  } else {
    set.forEach(item => {
      if (first) return
      first = item
    })
    return first
  }
}

export default new Batching()
