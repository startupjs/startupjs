import { useEffect, useCallback } from 'react'

export default function useTooltipActions ({ onChange }) {
  // const refTimeout = useRef()

  const onOpen = useCallback(() => {
    onChange(true)
  }, [onChange])

  const onClose = useCallback(() => {
    onChange(false)
  }, [onChange])

  useEffect(() => {
    window.addEventListener('wheel', onClose, true)
    return () => window.removeEventListener('wheel', onClose)
  }, [])

  return { onOpen, onClose }
}
