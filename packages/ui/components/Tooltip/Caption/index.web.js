import React, { useState } from 'react'
import { View } from 'react-native'

export default function TooltipCaption ({
  children,
  style,
  onChange
}) {
  const [hover, setHover] = useState(false)

  return pug`
    View(
      style=style
      styleName={ hover }
      onMouseOver=()=> setHover(true)
      onMouseLeave=()=> setHover(false)
    )= children
  `
}
