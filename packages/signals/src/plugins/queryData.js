import { IS_EXTRA_QUERY, QUERY, getSignal } from '../signal.js'

export function get (target, key, receiver) {
  if (target[QUERY]) {
    // with an extra query we go directly into its extra content
    // (for regular queries we just treat it as a collection path, so the default logic below works)
    if (target[IS_EXTRA_QUERY]) return getSignal([...target[QUERY].extraSegments, key], target)
    // special treatment for the magic 'ids' field of queries (returns signal to the actual ids path)
    if (key === 'ids') return getSignal([...target[QUERY].idsSegments])
  }
  this.next()
}
