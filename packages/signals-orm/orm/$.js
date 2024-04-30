// this is just the $() function implementation.
// The actual $ exported from this package is a Proxy targeting the dataTree root,
// and this function is an implementation of the `apply` handler for that Proxy.
import getSignal from './getSignal.js'
import { set as _set, del as _del } from './dataTree.js'

export const LOCAL = '$local'
let counter = 0

const valuesFr = new FinalizationRegistry(id => {
  _del([LOCAL, id])
})

export default function $ (value) {
  const id = `_${counter}`
  counter += 1
  _set([LOCAL, id], value)
  const $value = getSignal([LOCAL, id])
  valuesFr.register($value, id)
  return $value
}

// function _$ (id, value) {
//   if (typeof value === 'function') {
//     return reactionSignal(id, value, true)
//   } else {
//     return valueSignal(id, value, true)
//   }
// }

// function valueSignal (id, value, initialize) {
//   const $value = $local[id]
//   if (initialize) $value.set(value)
//   return $value
// }

// function reactionSignal (id, fn, initialize) {
//   // TODO
// }
