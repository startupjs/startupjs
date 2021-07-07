import { useEffect, useCallback, useRef } from 'react'

export default function useTooltipActions ({ onChange }) {
  const refTimeout = useRef()

  const onOpen = useCallback(() => {
    refTimeout.current = setTimeout(() => {
      if (!refTimeout.current) return
      onChange(true)
    }, 200)
  }, [onChange])

  const onClose = useCallback(() => {
    clearTimeout(refTimeout.current)
    onChange(false)
    refTimeout.current = null
  }, [onChange])

  useEffect(() => {
    window.addEventListener('wheel', onClose, true)
    return () => window.removeEventListener('wheel', onClose)
  }, [])

  return { onOpen, onClose }
}
