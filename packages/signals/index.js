// 'enabled' is a global magic flag which will be replaced by the build system (babel-preset-startupjs)
import enabled from '@startupjs/signals/enabled.js'
import { getSignal } from './src/signal.js'
export { enabled }
export { getSignal as signal }
export const $ = getSignal()
export const sub$ = function () { console.log('sub$ dummy fn. TODO: implement') } // TODO
export default $
