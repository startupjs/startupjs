// NOTE:
//   $() and sub$() are currently set to be universal ones which work in both
//   plain JS and React environments. In React they are tied to the observer() HOC.
//   This is done to simplify the API.
//   In future, we might want to separate the plain JS and React APIs
import getSignal from './orm/getSignal.js'
import { getRootSignal } from './orm/Root.js'
import { universal$ } from './react/hooks.js'

export { default as Signal } from './orm/Signal.js'
export { __DEBUG_SIGNALS_CACHE__, rawSignal, getSignalClass } from './orm/getSignal.js'
export { default as addModel } from './orm/addModel.js'
export { getSignal as signal }
export const $ = getRootSignal({ rootFunction: universal$ })
export default $
export { universalSub$ as sub$ } from './react/hooks.js'
export { default as observer } from './react/observer.js'

// the following are react-specific hook alternatives to $() and sub$() functions.
// In future we might want to expose them, but at the current time they are not needed
// and instead just the regular $() and sub$() functions are used since they are universal
// export { use$, useSub$ } from './react/hooks.js'
