import { getSignal, SEGMENTS, getModel } from '../signal.js'

export function get (target, key, receiver) {
  return getSignal([...target[SEGMENTS], key], target)
}

export function create (signal, segments, parentProxyTarget) {
  return signal
}

export function apply (target, parent, methodName, argumentsList) {
  const model = getModel(parent)
  return Reflect.apply(model[methodName], model, argumentsList)
}
