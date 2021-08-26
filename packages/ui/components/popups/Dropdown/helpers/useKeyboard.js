import { useEffect } from 'react'
import { Platform } from 'react-native'
import { useValue } from 'startupjs'

export default function ({ visible, value, options, onChange }) {
  const [selectIndex, $selectIndex] = useValue(-1)

  if (Platform.OS !== 'web') return [selectIndex, $selectIndex, null]

  useEffect(() => {
    if (visible) {
      document.addEventListener('keydown', onKeyDown)
    } else {
      document.removeEventListener('keydown', onKeyDown)
      $selectIndex.set(-1)
    }
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [visible, value])

  function onKeyDown (e) {
    e.preventDefault()
    e.stopPropagation()

    const selectIndex = $selectIndex.get()
    if (selectIndex === -1 && value) {
      $selectIndex.set(options.findIndex(option => option.value === value))
      return
    }

    switch (e.key) {
      case 'ArrowUp':
        if (selectIndex <= 0) return
        $selectIndex.set(selectIndex - 1)
        break

      case 'ArrowDown':
        if (selectIndex === options.length - 1) return
        $selectIndex.set(selectIndex + 1)
        break

      case 'Enter':
        if (selectIndex === -1) return
        onChange(options[selectIndex].value)
        break
    }
  }

  return [selectIndex]
}
