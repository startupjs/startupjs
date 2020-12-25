import React from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'

export default observer(function TooltipCaption ({ children, onChange }) {
  return pug`
    View(
      onMouseMove=()=> onChange(true)
      onMouseLeave=()=> onChange(false)
    )= children
  `
})
