import $ from '../orm/$.js'
import executionContextTracker from './executionContextTracker.js'

// universal versions of $() which work as a plain function or as a react hook
export default function universal$ ($root, value) {
  let id
  if (executionContextTracker.isActive()) id = executionContextTracker.newHookId()
  return $($root, value, id)
}
