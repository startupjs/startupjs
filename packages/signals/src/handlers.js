import {
  IS_SIGNAL, getParentSignal, getLeaf
} from './signal.js'
import runHook from './runHook.js'

// intercept get operations on observables to know which reaction uses their properties
function get (target, key, receiver) {
  // a way to check whether we are dealing with the proxy itself
  if (key === IS_SIGNAL) return true
  // don't do any custom processing on symbols
  if (typeof key === 'symbol') return Reflect.get(target, key, receiver)

  return runHook('get', target, key, receiver)
}

function apply (target, thisArg, argumentsList) {
  const methodName = getLeaf(target)
  const parent = getParentSignal(target)

  return runHook('apply', target, parent, methodName, argumentsList)
}

function has (target, key) {
  return Reflect.has(target, key)
}

function ownKeys (target) {
  return Reflect.ownKeys(target)
}

function set (target, key, value, receiver) {
  // don't do any custom processing on symbols
  if (typeof key === 'symbol') return Reflect.set(target, key, value, receiver)
  // TODO: Maybe only allow setting the internal symbols (for now we allow all)
  // // don't do any custom processing on internal symbols
  // if (isInternalSymbol(key)) return Reflect.set(target, key, value, receiver)
  throw Error(ERRORS.set)
}

function deleteProperty (target, key) {
  throw Error(ERRORS.deleteProperty)
}

export default { get, has, ownKeys, set, deleteProperty, apply }

const ERRORS = {
  set: 'You can\'t assign to a property of a model directly. ' +
    'Instead use: await $model.setDiffDeep(value) / .setEach(objectValue)',
  deleteProperty: 'You can\'t delete a property of a model directly. Instead use: await $model.del()'
}
