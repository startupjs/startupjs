import React, { useRef } from 'react'
import { View } from 'react-native'

export default function TooltipCaption ({
  children,
  style,
  onChange
}) {
  const refTimer = useRef()

  function onMouseOver () {
    clearTimeout(refTimer.current)
    refTimer.current = setTimeout(() => {
      onChange(true)
    }, 300)
  }

  function onMouseOut () {
    clearTimeout(refTimer.current)
    refTimer.current = null
    onChange(false)
  }

  return pug`
    View(
      onMouseOver=onMouseOver
      onMouseOut=onMouseOut
    )= children
  `
}
