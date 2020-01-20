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
  let Wrapper = typeof onPress === 'function'
    ? TouchableOpacity
    : View

  return pug`
    Wrapper.root(
      style=[style, SHADOWS[level]]
      styleName=[{
        'with-shadow': !!level,
        clickable: typeof onPress === 'function'
      }]
      activeOpacity=config.opacity.active
      onPress=onPress
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
