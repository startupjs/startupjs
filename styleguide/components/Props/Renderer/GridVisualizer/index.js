import React from 'react'
import { observer, useModel, useLocal } from 'startupjs'
import { View } from 'react-native'
import { Span, themed } from 'ui'
import './index.styl'

const GRID_SIZE = 8
const VALIDATE_WIDTH = false
const VALIDATE_HEIGHT = true
const ALLOW_HALF_UNIT = true

export default observer(function GridVisualizer ({
  validateWidth = VALIDATE_WIDTH,
  validateHeight = VALIDATE_HEIGHT,
  allowHalfUnit = ALLOW_HALF_UNIT,
  showGrid,
  style,
  children
}) {
  let $componentSize = useModel('_session.Renderer.componentSize')

  function onLayout (e) {
    let { width, height } = e.nativeEvent.layout
    $componentSize.setDiffDeep({ width, height })
  }

  return pug`
    View(style=style)
      View.horizontal
        View.leftBarWrapper
          View.filler
          LeftBar(allowHalfUnit=allowHalfUnit validate=validateHeight)
        View.vertical
          TopBar(allowHalfUnit=allowHalfUnit validate=validateWidth)
          View.content(onLayout=onLayout)
            | #{children}
            if showGrid
              View.gridVisualizer(pointerEvents='none')
`
})

const LeftBar = observer(themed(({ allowHalfUnit, validate, theme }) => {
  let [height = 0] = useLocal('_session.Renderer.componentSize.height')
  let units = toUnits(height)
  let valid = validate ? validateGrid(height, allowHalfUnit) : true

  return pug`
    View.leftBar
      View.leftBarLine(styleName=[theme, { valid }])
      View.leftBarUnits
        Span.leftBarText(styleName=[theme, { valid }])= units
      View.leftBarLine(styleName=[theme, { valid }])
  `
}))

const TopBar = observer(themed(({ allowHalfUnit, validate, theme }) => {
  let [width = 0] = useLocal('_session.Renderer.componentSize.width')
  let units = toUnits(width)
  let valid = validate ? validateGrid(width, allowHalfUnit) : true

  return pug`
    View.topBar
      View.topBarLine(styleName=[theme, { valid }])
      View.topBarUnits
        Span.topBarText(styleName=[theme, { valid }])= units
      View.topBarLine(styleName=[theme, { valid }])
  `
}))

function toUnits (pixels) {
  return Math.floor(pixels / GRID_SIZE * 10) / 10
}

function validateGrid (pixels, allowHalfUnit) {
  return (
    pixels % GRID_SIZE === 0 ||
    (allowHalfUnit && pixels % (GRID_SIZE / 2) === 0)
  )
}
