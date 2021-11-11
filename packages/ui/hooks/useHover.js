import { useState } from 'react'
import { Platform } from 'react-native'

export default function useHover (hoverStyle) {
  const [isHover, setIsHover] = useState(false)

  let hoverProps = {}

  if (Platform.OS === 'web') {
    hoverProps = {
      onMouseMove: () => setIsHover(true),
      onMouseLeave: () => setIsHover(false)
    }
  }

  return [hoverProps, isHover ? hoverStyle : {}]
}
