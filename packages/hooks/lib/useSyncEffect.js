import { useMemo, useRef } from 'react'
import useIsomorphicLayoutEffect from '@startupjs/utils/useIsomorphicLayoutEffect'

export default function useSyncEffect (fn, inputs) {
  const destroy = useRef()

  const destroyFn = () => {
    if (destroy.current) {
      typeof destroy.current === 'function' && destroy.current()
      destroy.current = undefined
    }
  }

  useMemo(() => {
    destroyFn()
    destroy.current = fn()
  }, inputs)

  // final destroy when component gets unmounted
  useIsomorphicLayoutEffect(() => {
    return destroyFn
  }, [])
}
