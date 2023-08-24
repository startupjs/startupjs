import { getSignal, SEGMENTS } from '../signal.js'

export function get (target, key, receiver) {
  return getSignal([...target[SEGMENTS], key])
}
