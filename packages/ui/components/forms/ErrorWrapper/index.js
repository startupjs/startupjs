import React from 'react'
import { Text } from 'react-native'
import { Div } from '@startupjs/ui'
import './index.styl'

export default ({
  style,
  children,
  err,
  position = 'bottom',
  ...otherProps
}) => {
  return pug`
    Div(style=style ...otherProps)
      if err && position === 'top'
        Text.text= err
      = children
      if err && position === 'bottom'
        Text.text= err
  `
}
