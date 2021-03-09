import React from 'react'
import { Text } from 'react-native'
import { Div } from '@startupjs/ui'
import './index.styl'

export default ({
  style,
  children,
  err,
  position = 'bottom'
}) => {
  return pug`
    Div(style=style)
      if err && position === 'top'
        Text.text= err
      = children
      if err && position === 'bottom'
        Text.text= err
  `
}
