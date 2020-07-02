import { useLayoutEffect, useRef } from 'react'

export default function useDidUpdate (fn, inputs) {
  const rendered = useRef()
  useLayoutEffect(() => {
    if (rendered.current) return fn()
    rendered.current = true
  }, inputs)
}
