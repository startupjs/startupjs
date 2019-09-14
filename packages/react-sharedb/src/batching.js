// Synchronous batching of functions execution
// Requires ES6 Set

export class Batching {
  constructor () {
    this.active = false
    this.queue = new Set()
    this.flushActive = false
  }

  batch (fn) {
    if (this.active) return fn()
    this.active = true
    fn()
    this.flush()
    this.active = false
  }

  flush () {
    if (this.flushActive) return
    this.flushActive = true
    while (true) {
      if (this.queue.size === 0) break
      let fn = getFirstItem(this.queue)
      this.queue.delete(fn)
      fn()
    }
    this.flushActive = false
  }

  add (fn) {
    if (!this.active) return fn()
    this.queue.add(fn)
  }
}

function getFirstItem (set) {
  if (set.values) {
    let it = set.values()
    let first = it.next()
    return first.value
    // Shim for IE
  } else {
    let first
    set.forEach(item => {
      if (first) return
      first = item
    })
    return first
  }
}

export default new Batching()
