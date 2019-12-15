import React from 'react'
import './index.styl'
import { Text, Platform } from 'react-native'
import { observer } from 'startupjs'

export default observer(function P ({
  style,
  children,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  normal,
  description,
  small,
  bold,
  ...props
}) {
  const isNative = Platform.OS !== 'web'

  const Tag = isNative ? Text : (h1 && 'h1') || (h2 && 'h2') || (h3 && 'h3') || (h4 && 'h4') || (h5 && 'h5') || (h6 && 'h6') || Text

  return pug`
    Tag.root(
      styleName={ h1, h2, h3, h4, h5, h6, normal, description, small, bold }
      style=style
      ...props
    )= children
  `
})
