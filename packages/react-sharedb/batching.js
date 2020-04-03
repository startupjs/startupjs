// Synchronous batching of functions execution
// Requires ES6 Set

function Batching () {
  this.active = false
  this.queue = new Set()
  this.flushActive = false
}

Batching.prototype.batch = function (fn) {
  if (this.active) return fn()
  this.active = true
  fn()
  this.flush()
  this.active = false
}

Batching.prototype.flush = function () {
  if (this.flushActive) return
  this.flushActive = true
  while (true) {
    if (this.queue.size === 0) break
    var fn = getFirstItem(this.queue)
    this.queue.delete(fn)
    fn()
  }
  this.flushActive = false
}

Batching.prototype.add = function (fn) {
  if (!this.active) return fn()
  this.queue.add(fn)
}

function getFirstItem (set) {
  var first
  if (set.values) {
    var it = set.values()
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

module.exports = new Batching()
