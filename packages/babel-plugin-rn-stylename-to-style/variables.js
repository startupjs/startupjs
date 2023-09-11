import { observable } from '@nx-js/observer-util'

export let defaultVariables = {}

export default observable({})

export function setDefaultVariables (variables = {}) {
  defaultVariables = { ...variables }
}
