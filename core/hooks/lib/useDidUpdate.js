import { useRef } from 'react'
import useIsomorphicLayoutEffect from '@startupjs/utils/useIsomorphicLayoutEffect'

export default function useDidUpdate (fn, inputs) {
  const rendered = useRef()
  useIsomorphicLayoutEffect(() => {
    if (rendered.current) return fn()
    rendered.current = true
  }, inputs)
}
