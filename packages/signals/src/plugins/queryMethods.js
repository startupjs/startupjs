// special treatment of Query methods
import { IS_EXTRA_QUERY, QUERY } from '../signal.js'

const QUERY_METHODS = ['get', 'getIds', 'getExtra', 'subscribe', 'unsubscribe', 'fetch', 'unfetch']
const isQueryMethod = method => QUERY_METHODS.includes(method)

export function get (target, key, receiver) {
  if (target[QUERY] && isQueryMethod(key)) {
    if (target[IS_EXTRA_QUERY] && key === 'get') key = 'getExtra'
    return (...args) => Reflect.apply(target[QUERY][key], target[QUERY], args)
  }
  this.next()
}
