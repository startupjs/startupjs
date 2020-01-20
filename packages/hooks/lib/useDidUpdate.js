import { useLayoutEffect, useRef } from 'react'

export default function useDidUpdate (fn, inputs) {
  const rendered = useRef()
  useLayoutEffect(() => {
    if (rendered) return fn()
    rendered.current = true
  }, inputs)
}
