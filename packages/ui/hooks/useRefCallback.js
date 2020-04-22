import { useRef, useCallback, useMemo } from 'react'

export default function useRefCallback (callback, isCallback) {
  const ref = useRef()

  const refCallback = useCallback(node => {
    if (!ref.current) {
      callback(node)
      ref.current = node
    }
  }, [])

  const resRef = useMemo(() => isCallback ? refCallback : ref, [isCallback])
  return resRef
}
