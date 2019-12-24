import React from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, View } from 'react-native'
import { observer } from 'startupjs'
import SHADOWS from './shadows'
import './index.styl'

function Div ({
  style,
  children,
  shadowSize,
  onPress,
  ...props
}) {
  let Wrapper = typeof onPress === 'function'
    ? TouchableOpacityWithShadow
    : View

  const shadow = shadowSize && SHADOWS[shadowSize] ? SHADOWS[shadowSize] : {}

  return pug`
    Wrapper.root(
      style=style
      styleName=[shadowSize, { 'with-shadow': !!shadowSize }],
      shadow=shadow
      ...shadow
      ...props
    )
      = children
  `
}

Div.propTypes = {
  shadowSize: PropTypes.oneOf(Object.keys(SHADOWS)),
  onPress: PropTypes.func
}

const TouchableOpacityWithShadow = observer(({
  style,
  children,
  shadow,
  ...props
}) => {
  return pug`
    View(...shadow style=style)
      TouchableOpacity(...props)= children
  `
})

export default observer(Div)
