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
  level,
  onPress,
  ...props
}) {
  const isClickable = typeof onPress === 'function'
  let Wrapper = isClickable
    ? TouchableOpacity
    : View

  const extraProps = {}

  if (isClickable) {
    extraProps.activeOpacity = config.opacity.active
  }

  return pug`
    Wrapper.root(
      style=[style, SHADOWS[level]]
      styleName=[{
        withShadow: !!level,
        clickable: isClickable
      }]
      onPress=onPress
      ...extraProps
      ...props
    )
      = children
  `
}

Div.defaultProps = {
  level: 0
}

Div.propTypes = {
  level: propTypes.oneOf(SHADOWS.map((key, index) => index)),
  onPress: propTypes.func
}

export default observer(Div)
