import { useId } from 'react'
import $ from '../orm/$.js'
import sub$ from '../orm/sub$.js'
import { observerTracker } from './trapRender.js'

export function use$ (value) {
  // TODO: maybe replace all non-letter/digit characters with underscores
  const id = useId() // eslint-disable-line react-hooks/rules-of-hooks
  return $(value, id)
}

export function useSub$ (...args) {
  const promiseOrSignal = sub$(...args)
  if (promiseOrSignal.then) throw promiseOrSignal
  return promiseOrSignal
}

// universal versions of $() and sub$() which work as a plain function or as a react hook
export function universal$ (value) {
  let id
  if (observerTracker.isActive()) id = observerTracker.newHookId()
  return $(value, id)
}

export function universalSub$ (...args) {
  const promiseOrSignal = sub$(...args)
  if (observerTracker.isActive() && promiseOrSignal.then) throw promiseOrSignal
  return promiseOrSignal
}
