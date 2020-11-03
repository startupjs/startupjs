import React from 'react'
import { Animated, StyleSheet } from 'react-native'
import './index.styl'

export default function Arrow ({
  style,
  geometry,
  rootPlacement
}) {
  const _arrowStyle = StyleSheet.flatten([
    style,
    {
      left: geometry.arrowLeftPosition || 0,
      top: geometry.arrowTopPosition || 0
    }
  ])

  if (_arrowStyle.color && (rootPlacement === 'top' ||
    rootPlacement === 'left' || rootPlacement === 'right')) {
    _arrowStyle.borderTopColor = _arrowStyle.color
  }
  if (_arrowStyle.color && rootPlacement === 'bottom') {
    _arrowStyle.borderBottomColor = _arrowStyle.color
  }

  return pug`
    Animated.View.arrow(
      style=_arrowStyle
      styleName={
        arrowBottom: rootPlacement === 'bottom',
        arrowTop: rootPlacement === 'top',
        arrowLeft: rootPlacement === 'left',
        arrowRight: rootPlacement === 'right',
      }
    )
  `
}
