import React from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import './index.styl'
import GridVisualizer from './GridVisualizer'
import { themed, Row } from 'ui'

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
  block,
  style
}) {
  let Wrapper
  let extraProps = {}
  if (showSizes) {
    Wrapper = GridVisualizer
    extraProps.block = block
  } else {
    Wrapper = block ? View : Row
  }
  return pug`
    Wrapper(
      ...extraProps
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
