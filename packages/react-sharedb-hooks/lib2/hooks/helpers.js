import { hooksCounter } from '../util'
import useSelf from './meta/useSelf'
import useMeta from './meta/useMeta'

export default function makeAsyncHook (fn) {
  return (...args) => {
    const $self = useSelf()
    const meta = useMeta()
    const hookIndex = hooksCounter.increment()
    if (meta.hooksReady[hookIndex]) {
      return $self.get(`__hooks._${hookIndex}`)
    }
    const promise = fn(...args)
    if (!(promise && promise.then)) {
      throw Error('[react-sharedb-hooks] makeAsyncHook(): your custom function must return a promise.')
    }
  }
}
