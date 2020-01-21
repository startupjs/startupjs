import React from 'react'
import propTypes from 'prop-types'
import { TouchableOpacity, View } from 'react-native'
import { observer } from 'startupjs'
import config from '../../config/rootConfig'
import './index.styl'

const SHADOWS = config.shadows

function Div ({
  style,
  children,
  disabled,
  level,
  onPress,
  ...props
}) {
  const isClickable = typeof onPress === 'function' && !disabled
  let Wrapper = isClickable
    ? TouchableOpacity
    : View

  const extraProps = {}

  if (isClickable) {
    extraProps.activeOpacity = config.opacity.active
    extraProps.onPress = onPress
  }

  return pug`
    Wrapper.root(
      style=[style, SHADOWS[level]]
      styleName=[{
        'with-shadow': !!level,
        clickable: isClickable
      }]
      ...extraProps
      ...props
    )
      = children
  `
}

Div.defaultProps = {
  level: 0,
  disabled: false
}

Div.propTypes = {
  level: propTypes.oneOf(SHADOWS.map((key, index) => index)),
  disabled: propTypes.bool,
  onPress: propTypes.func
}

export default observer(Div)
