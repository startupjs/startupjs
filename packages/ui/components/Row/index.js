import React from 'react'
import { Platform, StyleSheet } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from './../Div'
import themed from '../../theming/themed'
import './index.styl'

const isNative = Platform.OS !== 'web'

function Row ({
  style,
  children,
  align,
  vAlign,
  wrap,
  reverse,
  ...props
}) {
  // FIXME: for native apps row-reverse switches margins and paddings
  if (isNative && reverse) {
    style = StyleSheet.flatten([style])
    const { paddingLeft, paddingRight, marginLeft, marginRight } = style
    style.marginLeft = marginRight
    style.marginRight = marginLeft
    style.paddingLeft = paddingRight
    style.paddingRight = paddingLeft
  }

  return pug`
    Div.root(
      style=style
      styleName=[align, 'v_' + vAlign, { wrap, reverse }]
      ...props
    )
      = children
  `
}

Row.defaultProps = {
  wrap: false,
  reverse: false,
  align: 'left',
  vAlign: 'stretch',
  ...Div.defaultProps
}

Row.propTypes = {
  ...Div.propTypes,
  wrap: PropTypes.bool,
  reverse: PropTypes.bool,
  align: PropTypes.oneOf(['left', 'center', 'right', 'around', 'between']),
  vAlign: PropTypes.oneOf(['stretch', 'start', 'center', 'end'])
}

export default observer(themed('Row', Row))
