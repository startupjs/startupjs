import { SEGMENTS } from '../signal.js'

const REGEX_$ = /^\$/
const LOCAL_COLLECTIONS_MAPPING = {
  session: '_session',
  page: '_page',
  render: '$render'
}

export function get (target, key, receiver) {
  // for simplified destructuring the $key is aliased to key.
  // To explicitly get the $key use $$key
  if (REGEX_$.test(key)) key = key.slice(1)

  // perform additional mapping for $-collections and _-collections
  if (target[SEGMENTS].length === 0) key = LOCAL_COLLECTIONS_MAPPING[key] || key

  this.next(target, key, receiver)
}
