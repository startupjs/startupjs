import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { observer } from 'startupjs'
import SHADOWS from './shadows'
import './index.styl'

export default observer(function Div ({
  style,
  children,
  shadowSize, // s, m, l, xl
  onPress
}) {
  let Wrapper = typeof onPress === 'function' ? TouchableOpacity : View

  const shadow = shadowSize && SHADOWS[shadowSize] ? SHADOWS[shadowSize] : {}

  return pug`
    Wrapper.root(
      style=style
      styleName=[shadowSize, shadowSize && 'with-shadow']
      ...shadow
    )
      = children
  `
})
