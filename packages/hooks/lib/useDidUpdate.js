import { useLayoutEffect, useRef } from 'react'

// Execute always when condition changed except first render
export default function useDidUpdate (fn, trigger = []) {
  const firstUpdate = useRef(true)
  useLayoutEffect(
    () => {
      if (firstUpdate.current) {
        firstUpdate.current = false
      } else {
        fn()
      }
    },
    trigger
  )
}
