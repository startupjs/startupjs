import React from 'react'
import { Text } from 'react-native'
import { observer } from 'startupjs'
import { Div } from '@startupjs/ui'
import themed from '../../../theming/themed'
import './index.styl'

function InputErrorWrapper ({
  style,
  children,
  err,
  position = 'bottom',
  ...otherProps
}) {
  return pug`
    Div(style=style ...otherProps)
      if err && position === 'top'
        Text.text.top= err
      = children
      if err && position === 'bottom'
        Text.text.bottom= err
  `
}

export default observer(themed(InputErrorWrapper))
