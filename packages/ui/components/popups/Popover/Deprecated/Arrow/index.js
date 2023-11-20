import React from 'react'
import { Animated, StyleSheet } from 'react-native'
import { pug } from 'startupjs'
import './index.styl'

export default function Arrow ({
  style,
  geometry,
  validPosition
}) {
  if (geometry && geometry.validPlacement) {
    [validPosition] = geometry.validPlacement.split('-')
  }

  const _arrowStyle = StyleSheet.flatten([
    style,
    {
      left: geometry ? geometry.arrowLeftPosition : 0,
      top: geometry ? geometry.arrowTopPosition : 0
    }
  ])

  if (_arrowStyle.color && (validPosition === 'top' ||
    validPosition === 'left' || validPosition === 'right')) {
    _arrowStyle.borderTopColor = _arrowStyle.color
  }
  if (_arrowStyle.color && validPosition === 'bottom') {
    _arrowStyle.borderBottomColor = _arrowStyle.color
  }

  return pug`
    Animated.View.arrow(
      style=_arrowStyle
      styleName={
        arrowBottom: validPosition === 'bottom',
        arrowTop: validPosition === 'top',
        arrowLeft: validPosition === 'left',
        arrowRight: validPosition === 'right',
      }
    )
  `
}
