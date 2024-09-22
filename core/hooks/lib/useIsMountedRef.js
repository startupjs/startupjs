import { useEffect, useRef } from 'react'

export default function useIsMountedRef () {
  const isMountedRef = useRef(true)
  useEffect(() => () => { isMountedRef.current = false }, [])
  return isMountedRef
}
