import React from 'react'
import { observer } from 'startupjs'
import { Switch } from 'react-native'
import { Row, Span, Div } from '@startupjs/ui'
import {
  useShowGrid,
  useShowSizes,
  useValidateWidth,
  useDarkTheme
} from 'clientHelpers'
import './index.styl'

export default observer(function Options ({
  style
}) {
  const [showGrid, $showGrid] = useShowGrid()
  const [showSizes, $showSizes] = useShowSizes()
  const [validateWidth, $validateWidth] = useValidateWidth()
  const [darkTheme, $darkTheme] = useDarkTheme()

  return pug`
    Div
      if showSizes
        Row.line(vAlign='center')
          Span.label(description) VALIDATE WIDTH
          Switch(
            value=validateWidth
            onValueChange=value => $validateWidth.set(value)
          )
        Row.line(vAlign='center')
          Span.label(description) SHOW GRID
          Switch(
            value=showGrid
            onValueChange=value => $showGrid.set(value)
          )
      Row.line(vAlign='center')
        Span.label(description) SHOW SIZES
        Switch(
          value=showSizes
          onValueChange=value => $showSizes.set(value)
        )
      Row.line(vAlign='center')
        Span.label(description) DARK THEME
        Switch(
          value=darkTheme
          onValueChange=value => $darkTheme.set(value)
        )
  `
})
