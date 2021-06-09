import { useEffect, useRef } from 'react'

export default function useTooltipProps ({ onChange }) {
  const refTimeout = useRef()

  useEffect(() => {
    window.addEventListener('wheel', onClose, true)
    return () => window.removeEventListener('wheel', onClose)
  }, [])

  function onOpen () {
    refTimeout.current = setTimeout(() => {
      if (!refTimeout.current) return
      onChange(true)
    }, 200)
  }

  function onClose () {
    clearTimeout(refTimeout.current)
    onChange(false)
    refTimeout.current = null
  }

  return { onOpen, onClose }
}
