import React from 'react'
import { View } from 'react-native'
import { observer, useValue } from 'startupjs'
import { themed, Row } from '@startupjs/ui'
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
  const [, $visible] = useValue(false)

  let Wrapper
  let extraProps = {}
  if (showSizes) {
    Wrapper = GridVisualizer
    extraProps.block = block
  } else {
    Wrapper = block ? View : Row
  }

  // TODO: This hack is used to make onDismiss work correctly.
  // Fix it when https://github.com/facebook/react-native/pull/29882 is released.
  if (Component.displayName.includes('Modal')) {
    props = { ...props, $visible }
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
