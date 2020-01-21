import React from 'react'
import { Text, View } from 'react-native'
import { observer } from 'startupjs'
import './index.styl'
import GridVisualizer from './GridVisualizer'
import useTheme from '@startupjs/ui/config/useTheme'

const DEFAULT_WRAP_CHILDREN = false

export default observer(function Renderer ({
  Component,
  wrapChildren = DEFAULT_WRAP_CHILDREN,
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
  let [, Theme] = useTheme(theme)
  let Wrapper = showSizes ? GridVisualizer : View
  return pug`
    Wrapper(
      style=style
      validateWidth=validateWidth
      validateHeight=validateHeight
      allowHalfUnit=allowHalfUnit
      showGrid=showGrid
    )
      Theme
        Component(...props)
          if children
            if wrapChildren && typeof children === 'string'
              Text= children
            else
              | #{children}
  `
})
