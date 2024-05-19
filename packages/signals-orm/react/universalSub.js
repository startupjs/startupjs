import sub from '../orm/sub.js'
import executionContextTracker from './executionContextTracker.js'

// universal versions of sub() which work as a plain function or as a react hook
export default function universalSub (...args) {
  const promiseOrSignal = sub(...args)
  if (executionContextTracker.isActive() && promiseOrSignal.then) throw promiseOrSignal
  return promiseOrSignal
}
