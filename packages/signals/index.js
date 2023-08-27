// 'enabled' is a global magic flag which will be replaced by the build system (babel-preset-startupjs)
import enabled from '@startupjs/signals/enabled.js'
import { getSignal } from './src/signal.js'
export { enabled }
export { getSignal as signal }
export { sub$ } from './src/sub.js'
export const $ = getSignal()
export default $
