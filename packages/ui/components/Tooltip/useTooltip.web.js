import { useEffect, useRef } from 'react'

export default function useTooltip ({ onChange }) {
  const refTimeout = useRef()

  useEffect(() => {
    window.addEventListener('wheel', onDisable, true)
    return () => window.removeEventListener('wheel', onDisable)
  }, [])

  function onMouseOver () {
    refTimeout.current = setTimeout(() => {
      if (!refTimeout.current) return
      onChange(true)
    }, 200)
  }

  function onDisable () {
    clearTimeout(refTimeout.current)
    onChange(false)
    refTimeout.current = null
  }

  return {
    onMouseOver,
    onMouseLeave: onDisable
  }
}
