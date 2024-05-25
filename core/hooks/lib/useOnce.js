import { useMemo } from 'react'

// Execute once when condition becomes truthy
export default function useOnce (condition, fn) {
  useMemo(
    () => {
      if (!condition) return
      fn()
    },
    [!!condition]
  )
}
