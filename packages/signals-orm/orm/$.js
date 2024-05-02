// this is just the $() function implementation.
// The actual $ exported from this package is a Proxy targeting the dataTree root,
// and this function is an implementation of the `apply` handler for that Proxy.
import { observe, unobserve } from '@nx-js/observer-util'
import getSignal from './getSignal.js'
import { set as _set, del as _del } from './dataTree.js'

export const LOCAL = '$local'
const DELETION_DELAY = 0
let counter = 0

const valuesFr = new FinalizationRegistry(id => {
  _del([LOCAL, id])
})

const reactionsFr = new FinalizationRegistry(([reaction, id]) => {
  unobserve(reaction)
  // don't delete data right away to prevent dependent reactions which are also going to be GC'ed
  // from triggering unnecessarily
  setTimeout(() => _del([LOCAL, id]), DELETION_DELAY)
})

export default function $ (value) {
  if (typeof value === 'function') {
    return reaction$(value)
  } else {
    return value$(value)
  }
}

function value$ (value) {
  const id = `_${counter}`
  counter += 1
  _set([LOCAL, id], value)
  const $value = getSignal([LOCAL, id])
  valuesFr.register($value, id)
  return $value
}

function reaction$ (fn) {
  const id = `_${counter}`
  counter += 1
  const reactionScheduler = reaction => runReaction(reaction, id)
  const reaction = observe(fn, { lazy: true, scheduler: reactionScheduler })
  runReaction(reaction, id)
  const $value = getSignal([LOCAL, id])
  reactionsFr.register($value, [reaction, id])
  return $value
}

function runReaction (reaction, id) {
  const newValue = reaction()
  _set([LOCAL, id], newValue)
}
