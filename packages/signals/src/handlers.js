import { getSignal, isInternalSymbol, SEGMENTS, QUERY, IS_EXTRA_QUERY, getModel, getParentSignal, getLeaf } from './signal.js'

const REGEX_$ = /^\$/
const COLLECTIONS_MAPPING = {
  session: '_session',
  page: '_page',
  render: '$render'
}
const QUERY_METHODS = ['get', 'getIds', 'getExtra', 'subscribe', 'unsubscribe', 'fetch', 'unfetch']
export const isQueryMethod = method => QUERY_METHODS.includes(method)

// intercept get operations on observables to know which reaction uses their properties
function get (target, key, receiver) {
  // don't do any custom processing on symbols
  if (typeof key === 'symbol') return Reflect.get(target, key, receiver)

  // special treatment of Query methods
  if (target[QUERY]) {
    if (isQueryMethod(key)) {
      return Reflect.get(target[QUERY], key, target[QUERY])
    }
    // support .map() on regular queries (for looping in JSX)
    if (!target[IS_EXTRA_QUERY] && key === 'map') {
      const ids = target[QUERY].getIds()
      const segments = [...target[SEGMENTS]] // clone this array to help GC, since we return clojure fns
      return (fn, thisArg) => ids.map(id => getSignal([...segments, id])).map(fn, thisArg)
    }
  }

  // for simplified destructuring the $key is aliased to key.
  // To explicitly get the $key use $$key
  if (REGEX_$.test(key)) key = key.slice(1)

  // perform additional mapping for $-collections and _-collections
  if (target[SEGMENTS].length === 0) key = COLLECTIONS_MAPPING[key] || key

  if (target[QUERY]) {
    // with an extra query we go directly into its extra content
    // (for regular queries we just treat it as a collection path, so the default logic below works)
    if (target[IS_EXTRA_QUERY]) return getSignal([...target[QUERY].extraSegments, key])
    // special treatment for the magic 'ids' field of queries (returns signal to the actual ids path)
    if (key === 'ids') return getSignal([...target[QUERY].idsSegments])
  }
  return getSignal([...target[SEGMENTS], key])
}

function apply (target, thisArg, argumentsList) {
  const methodName = getLeaf(target)
  const parent = getParentSignal(target)
  const model = getModel(parent)
  return Reflect.apply(model[methodName], model, argumentsList)
}

function has (target, key) {
  return Reflect.has(target, key)
}

function ownKeys (target) {
  return Reflect.ownKeys(target)
}

function set (target, key, value, receiver) {
  // don't do any custom processing on internal symbols
  if (isInternalSymbol(key)) return Reflect.set(target, key, value, receiver)
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
