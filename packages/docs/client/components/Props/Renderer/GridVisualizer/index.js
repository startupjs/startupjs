import React from 'react'
import { pug, observer, useModel, useLocal } from 'startupjs'
import { themed, Div, Span, Row } from '@startupjs/ui'
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
  block,
  style,
  children
}) {
  let $componentSize = useModel('_session.Renderer.componentSize')

  function onLayout (e) {
    let { width, height } = e.nativeEvent.layout
    $componentSize.setDiffDeep({ width, height })
  }

  // TODO: Bring back width check as an option. For now it's commented out.
  return pug`
    Row.vertical
      LeftBar(
        allowHalfUnit=allowHalfUnit
        validate=validateHeight
      )
      // TopBar(allowHalfUnit=allowHalfUnit validate=validateWidth)
      // it's style for component wrapper!!!
      Div.content(
        style=style
        styleName={ block }
        onLayout=onLayout
      )
        | #{children}
        if showGrid
          Div.gridVisualizer(pointerEvents='none')
`
})

const LeftBar = observer(themed(({ allowHalfUnit, validate, theme }) => {
  let [height = 0] = useLocal('_session.Renderer.componentSize.height')
  let units = toUnits(height)
  let valid = validate ? validateGrid(height, allowHalfUnit) : true

  return pug`
    Div.leftBar
      Row.leftBarWrapper(style={ width: height })
        Div.leftBarLine(styleName=[theme, { valid }])
        Span.leftBarText(styleName=[theme, { valid }])= units
        Div.leftBarLine(styleName=[theme, { valid }])
  `
}))

// TODO: Bring back width check as an option. For now it's commented out.
// const TopBar = observer(themed(({ allowHalfUnit, validate, theme }) => {
//   let [width = 0] = useLocal('_session.Renderer.componentSize.width')
//   let units = toUnits(width)
//   let valid = validate ? validateGrid(width, allowHalfUnit) : true

//   return pug`
//     View.topBar
//       View.topBarLine(styleName=[theme, { valid }])
//       View.topBarUnits
//         Text.topBarText(styleName=[theme, { valid }])= NBSP + units + NBSP
//       View.topBarLine(styleName=[theme, { valid }])
//   `
// }))

function toUnits (pixels) {
  return Math.floor(pixels / GRID_SIZE * 10) / 10
}

function validateGrid (pixels, allowHalfUnit) {
  return (
    pixels % GRID_SIZE === 0 ||
    (allowHalfUnit && pixels % (GRID_SIZE / 2) === 0)
  )
}
