import React from 'react'
import { observer, useModel, useLocal } from 'startupjs'
import { View, Text } from 'react-native'
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

const LeftBar = observer(({ allowHalfUnit, validate }) => {
  let [height = 0] = useLocal('_session.Renderer.componentSize.height')
  let units = toUnits(height)
  let valid = validate ? validateGrid(height, allowHalfUnit) : true

  return pug`
    View.leftBar
      View.leftBarLine(styleName={ valid })
      View.leftBarUnits
        Text.leftBarText(styleName={ valid })= units
      View.leftBarLine(styleName={ valid })
  `
})

const TopBar = observer(({ allowHalfUnit, validate }) => {
  let [width = 0] = useLocal('_session.Renderer.componentSize.width')
  let units = toUnits(width)
  let valid = validate ? validateGrid(width, allowHalfUnit) : true

  return pug`
    View.topBar
      View.topBarLine(styleName={ valid })
      View.topBarUnits
        Text.topBarText(styleName={ valid })= units
      View.topBarLine(styleName={ valid })
  `
})

function toUnits (pixels) {
  return Math.floor(pixels / GRID_SIZE * 10) / 10
}

function validateGrid (pixels, allowHalfUnit) {
  return (
    pixels % GRID_SIZE === 0 ||
    (allowHalfUnit && pixels % (GRID_SIZE / 2) === 0)
  )
}
