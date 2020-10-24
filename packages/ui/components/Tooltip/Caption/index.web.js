import React, { useRef } from 'react'
import { View } from 'react-native'

export default function TooltipCaption ({
  children,
  style,
  _onChange
}) {
  const refTimer = useRef()

  function onMouseOver () {
    clearTimeout(refTimer.current)
    refTimer.current = setTimeout(() => {
      _onChange(true)
    }, 500)
  }

  function onMouseOut () {
    clearTimeout(refTimer.current)
    refTimer.current = null
    _onChange(false)
  }

  return pug`
    View(
      style=style
      onMouseOver=onMouseOver
      onMouseOut=onMouseOut
    )= children
  `
}
