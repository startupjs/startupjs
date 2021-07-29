import React from 'react'
import { observer } from 'startupjs'
import {
  faAngleDown,
  faAngleUp,
  faMinus,
  faPlus
} from '@fortawesome/free-solid-svg-icons'
import Button from '../../Button'
import Div from '../../Div'
import themed from '../../../theming/themed'
import './index.styl'

function NumberInputButtons ({
  style,
  buttonStyle,
  mode,
  size,
  disabled,
  children,
  onIncrement
}) {
  const buttonStyleNames = [mode]

  return pug`
    Div(style=style)
      = children
      if mode !== 'none'
        Button.input-button.increase(
          style=buttonStyle
          styleName=buttonStyleNames
          accessible=false
          color='darkLight'
          disabled=disabled
          icon=mode === 'horizontal' ? faPlus : faAngleUp
          size=size
          variant='outlined'
          onPress=() => onIncrement(1)
        )
        Button.input-button.decrease(
          style=buttonStyle
          styleName=buttonStyleNames
          accessible=false
          color='darkLight'
          disabled=disabled
          icon=mode === 'horizontal' ? faMinus : faAngleDown
          size=size
          variant='outlined'
          onPress=() => onIncrement(-1)
        )
  `
}

export default observer(themed('NumberInput', NumberInputButtons))
