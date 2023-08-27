// special support for .map() on any array data in racer model (for looping in JSX)
import { getSignal, SEGMENTS, getModel } from '../signal.js'

export function apply (target, parent, methodName, argumentsList) {
  const model = getModel(parent)
  // special support for .map() on any array data (for looping in JSX)
  if (methodName === 'map') {
    const items = model.get() || []
    const segments = [...parent[SEGMENTS]] // clone to help GC cleanup clojure fns
    return items.map((item, index) => getSignal([...segments, index])).map(...argumentsList)
  }
  this.next()
}
