import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { observer } from 'startupjs'
import SHADOWS from './shadows'
import './index.styl'

export default observer(function Div ({
  style,
  children,
  onPress,
  shadowSize // s, m, l, xl
}) {
  const Wrapper = typeof onPress === 'function' ? TouchableOpacity : View

  return pug`
    Wrapper.root(
      shadowSize && ...SHADOWS[shadowSize]
      style=style
      styleName=[shadowSize]
    )
      = children
  `
})
