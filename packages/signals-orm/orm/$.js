// this is just the $() function implementation.
// The actual $ exported from this package is a Proxy targeting the dataTree root,
// and this function is an implementation of the `apply` handler for that Proxy.
import getSignal from './getSignal.js'
import { LOCAL, valueSubscriptions } from './Value.js'
import { reactionSubscriptions } from './Reaction.js'

export { LOCAL } from './Value.js'

let counter = 0

function newIncrementalId () {
  const id = `_${counter}`
  counter += 1
  return id
}

export default function $ (value, id) {
  if (typeof value === 'function') {
    return reaction$(value, id)
  } else {
    return value$(value, id)
  }
}

function value$ (value, id = newIncrementalId()) {
  const $value = getSignal([LOCAL, id])
  valueSubscriptions.init($value, value)
  return $value
}

function reaction$ (fn, id = newIncrementalId()) {
  const $value = getSignal([LOCAL, id])
  reactionSubscriptions.init($value, fn)
  return $value
}
