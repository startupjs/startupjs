import React from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import './index.styl'
import GridVisualizer from './GridVisualizer'
import { themed } from 'ui'

export default observer(themed(function Renderer ({
  Component,
  props: {
    children,
    ...props
  },
  showSizes = true,
  showGrid,
  validateWidth,
  validateHeight,
  allowHalfUnit,
  theme,
  style
}) {
  let Wrapper = showSizes ? GridVisualizer : View
  return pug`
    Wrapper(
      style=style
      validateWidth=validateWidth
      validateHeight=validateHeight
      allowHalfUnit=allowHalfUnit
      showGrid=showGrid
    )
      Component(...props)
        = children
  `
}))
