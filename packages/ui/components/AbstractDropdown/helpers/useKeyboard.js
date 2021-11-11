import { useRef, useEffect } from 'react'

import { Platform } from 'react-native'

export default function useKeyboard ({ itemsLength, onChange, onEnter }) {
  if (Platform.OS !== 'web') return

  const scope = useRef(-1)

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      onChange(-1)
    }
  }, [])

  function onKeyDown (e) {
    e.preventDefault()
    e.stopPropagation()

    if (scope.current === -1) onChange(0)

    switch (e.key) {
      case 'ArrowUp':
        if (scope.current - 1 < 0) return
        scope.current -= 1
        onChange(scope.current)
        break

      case 'ArrowDown':
        if (scope.current + 1 === itemsLength) return
        scope.current += 1
        onChange(scope.current)
        break

      case 'Enter':
        if (scope.current === -1) return
        onEnter(scope.current)
        break
    }
  }
}
