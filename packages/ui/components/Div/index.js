import React from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, View, Platform } from 'react-native'
import { observer } from 'startupjs'
import SHADOWS from './shadows'
import './index.styl'
const { OS } = Platform
function Div ({
  style,
  children,
  shadow,
  onPress,
  ...props
}) {
  const isNative = OS !== 'web'

  let Wrapper = typeof onPress === 'function'
    ? TouchableOpacity
    : View

  const shadowProps = SHADOWS[shadow] ? SHADOWS[shadow] : {}

  const styles = [style]
  if (isNative) styles.push(shadowProps)

  return pug`
    Wrapper.root(
      style=styles
      styleName=[shadow, { 'with-shadow': !!shadow }]
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
