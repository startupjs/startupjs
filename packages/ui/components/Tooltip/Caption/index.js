import React from 'react'
import Div from '../../Div'

export default function TooltipCaption ({
  children,
  style,
  onChange
}) {
  return pug`
    Div(
      style=style
      onPress=()=> onChange(true)
    )= children
  `
}
