import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { observer } from 'startupjs'
import SHADOWS from './shadows'
import './index.styl'

export default observer(function Div ({
  style,
  children,
  shadowSize, // s, m, l, xl
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
      styleName=[shadowSize ? shadowSize : '', shadowSize ? 'with-shadow' : '']
      shadow=shadow
      ...shadow
      ...props
    )
      = children
  `
})

function TouchableOpacityWithShadow ({ style, children, shadow, ...props }) {
  return pug`
    View(...shadow style=style)
      TouchableOpacity(...props)= children
  `
}
