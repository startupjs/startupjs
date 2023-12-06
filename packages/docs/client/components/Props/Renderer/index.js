import React from 'react'
import { pug, observer } from 'startupjs'
import { themed, Div } from '@startupjs/ui'
import GridVisualizer from './GridVisualizer'

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
  const extraProps = {}
  if (showSizes) {
    Wrapper = GridVisualizer
    extraProps.block = block
  } else {
    Wrapper = Div
    extraProps.row = !block
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
