import { useLayoutEffect, useMemo, useRef } from 'react'

export default function useSyncEffect (fn, inputs) {
  const destroy = useRef()

  const destroyFn = () => {
    if (destroy.current) {
      typeof destroy.current === 'function' && destroy.current()
      destroy.current = undefined
    }
  }

  destroy.current = useMemo(() => {
    destroyFn()
    return fn()
  }, inputs)

  // final destroy when component gets unmounted
  useLayoutEffect(() => {
    return destroyFn
  }, [])
}
