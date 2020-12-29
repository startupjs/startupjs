import { useLayoutEffect, useState } from 'react'
import { Dimensions } from 'react-native'

export default function useLayoutSize () {
  const [layoutWidth, setLayoutWidth] = useState(null)

  useLayoutEffect(() => {
    if (!layoutWidth) handleWidthChange()
    Dimensions.addEventListener('change', handleWidthChange)
    return () => Dimensions.removeEventListener('change', handleWidthChange)
  }, [])

  const handleWidthChange = () => {
    setLayoutWidth(Math.min(Dimensions.get('window').width, Dimensions.get('screen').width))
  }

  return [layoutWidth, setLayoutWidth]
}
