import getSignal from './getSignal.js'
import $ from './$.js'

export const ROOT_FUNCTION = Symbol('root function')

export function getRootSignal ({
  rootFunction = $,
  ...options
}) {
  const $root = getSignal([], options)
  $root[ROOT_FUNCTION] ??= rootFunction
  return $root
}
