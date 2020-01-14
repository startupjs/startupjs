import React from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, View, Platform } from 'react-native'
import { observer } from 'startupjs'
import SHADOWS from './shadows'
import './index.styl'

function Div ({
  style,
  children,
  shadow,
  onPress,
  ...props
}) {
  const isNative = Platform.OS !== 'web'

  let Wrapper = typeof onPress === 'function'
    ? TouchableOpacity
    : View

  const shadowProps = SHADOWS[shadow] ? SHADOWS[shadow] : {}

  return pug`
    Wrapper.root(
      style=[style, isNative && !!onPress && shadowProps]
      styleName=[shadow, { 'with-shadow': !!shadow }]
      ...shadowProps
      onPress=onPress
      ...props
    )
      = children
  `
}

Div.propTypes = {
  shadow: PropTypes.oneOf(Object.keys(SHADOWS)),
  onPress: PropTypes.func
}

export default observer(Div)
