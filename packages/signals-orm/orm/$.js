// this is just the $() function implementation.
// The actual $ exported from this package is a Proxy targeting the dataTree root,
// and this function is an implementation of the `apply` handler for that Proxy.
import getSignal from './getSignal.js'
import Signal from './Signal.js'
import { LOCAL, valueSubscriptions } from './Value.js'
import { reactionSubscriptions } from './Reaction.js'

export { LOCAL } from './Value.js'

let counter = 0

function newIncrementalId () {
  const id = `_${counter}`
  counter += 1
  return id
}

export default function $ ($root, value, id) {
  if (!($root instanceof Signal)) throw Error('First argument of $() should be a Root Signal')
  if (typeof value === 'function') {
    return reaction$($root, value, id)
  } else {
    return value$($root, value, id)
  }
}

function value$ ($root, value, id = newIncrementalId()) {
  const $value = getSignal($root, [LOCAL, id])
  valueSubscriptions.init($value, value)
  return $value
}

function reaction$ ($root, fn, id = newIncrementalId()) {
  const $value = getSignal($root, [LOCAL, id])
  reactionSubscriptions.init($value, fn)
  return $value
}
