// NOTE:
//   $() and sub() are currently set to be universal ones which work in both
//   plain JS and React environments. In React they are tied to the observer() HOC.
//   This is done to simplify the API.
//   In future, we might want to separate the plain JS and React APIs
import { getRootSignal as _getRootSignal, GLOBAL_ROOT_ID } from './orm/Root.js'
import universal$ from './react/universal$.js'

export { default as Signal, SEGMENTS } from './orm/Signal.js'
export { __DEBUG_SIGNALS_CACHE__, rawSignal, getSignalClass } from './orm/getSignal.js'
export { default as addModel } from './orm/addModel.js'
export { default as signal } from './orm/getSignal.js'
export { GLOBAL_ROOT_ID } from './orm/Root.js'
export const $ = _getRootSignal({ rootId: GLOBAL_ROOT_ID, rootFunction: universal$ })
export default $
export { default as sub } from './react/universalSub.js'
export { default as observer } from './react/observer.js'
export { connection, setConnection, getConnection, fetchOnly, setFetchOnly } from './orm/connection.js'
export * from './schema/associations.js'
export { default as GUID_PATTERN } from './schema/GUID_PATTERN.js'
export { default as pickFormFields } from './schema/pickFormFields.js'

export function getRootSignal (options) {
  return _getRootSignal({
    rootFunction: universal$,
    ...options
  })
}

// the following are react-specific hook alternatives to $() and sub() functions.
// In future we might want to expose them, but at the current time they are not needed
// and instead just the regular $() and sub() functions are used since they are universal
//
// export function use$ (value) {
//   // TODO: maybe replace all non-letter/digit characters with underscores
//   const id = useId() // eslint-disable-line react-hooks/rules-of-hooks
//   return $(value, id)
// }

// export function useSub (...args) {
//   const promiseOrSignal = sub(...args)
//   if (promiseOrSignal.then) throw promiseOrSignal
//   return promiseOrSignal
// }
