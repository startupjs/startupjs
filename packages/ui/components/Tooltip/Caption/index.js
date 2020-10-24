import React from 'react'
import { TouchableOpacity } from 'react-native'

export default function TooltipCaption ({
  children,
  style,
  _onChange
}) {
  return pug`
    TouchableOpacity(
      style=style
      onPress=()=> _onChange(true)
    )= children
  `
}
