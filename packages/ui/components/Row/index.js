import React from 'react'
import './index.styl'
import { View } from 'react-native'
import { observer } from 'startupjs'
import c from '../../helpers/c'

export default observer(function Row ({
  style,
  children,
  reverse,
  right,
  center,
  vCenter,
  wrap,
  around,
  between,
  ...props
}) {
  return pug`
    View(
      styleName=c('root', { reverse, right, center, vCenter, wrap, around, between })
      style=style
      ...props
    )
      = children
  `
})
