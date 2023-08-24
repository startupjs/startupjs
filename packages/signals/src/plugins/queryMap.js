// special support for .map() on queries and regular signals (for looping in JSX)

import { IS_EXTRA_QUERY, QUERY, getSignal, SEGMENTS } from '../signal.js'

export function get (target, key, receiver) {
  if (target[QUERY] && key === 'map') {
    if (target[IS_EXTRA_QUERY]) {
      const items = target[QUERY].getExtra() || []
      const segments = [...target[QUERY].extraSegments] // clone to help GC cleanup clojure fns
      return (fn, thisArg) => items.map((item, index) => getSignal([...segments, index])).map(fn, thisArg)
    } else {
      const ids = target[QUERY].getIds()
      const segments = [...target[SEGMENTS]] // clone to help GC cleanup clojure fns
      return (fn, thisArg) => ids.map(id => getSignal([...segments, id])).map(fn, thisArg)
    }
  }
  this.next()
}
