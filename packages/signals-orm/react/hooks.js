import { useId } from 'react'
import $ from '../orm/$.js'
import sub$ from '../orm/sub$.js'

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
