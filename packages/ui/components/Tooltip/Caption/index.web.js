import React from 'react'
import { View } from 'react-native'

export default function TooltipCaption ({
  children,
  onChange
}) {
  return pug`
    View(
      onMouseMove=()=> onChange(true)
      onMouseLeave=()=> onChange(false)
    )= children
  `
}
