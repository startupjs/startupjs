import React from 'react'
import { pug, observer } from 'startupjs'
import {
  faAngleDown,
  faAngleUp,
  faMinus,
  faPlus
} from '@fortawesome/free-solid-svg-icons'
import Button from '../../Button'
import themed from '../../../theming/themed'
import './index.styl'

function NumberInputButtons ({
  buttonStyle,
  mode,
  size,
  disabled,
  onIncrement
}) {
  const buttonStyleNames = [mode]

  return pug`
    if mode !== 'none'
      Button.input-button.increase(
        style=buttonStyle
        styleName=buttonStyleNames
        focusable=false
        disabled=disabled
        icon=mode === 'horizontal' ? faPlus : faAngleUp
        size=size
        variant='outlined'
        onPress=() => onIncrement(1)
        accessibilityRole='button'
      )
      Button.input-button.decrease(
        style=buttonStyle
        styleName=buttonStyleNames
        focusable=false
        disabled=disabled
        icon=mode === 'horizontal' ? faMinus : faAngleDown
        size=size
        variant='outlined'
        onPress=() => onIncrement(-1)
        accessibilityRole='button'
      )
  `
}

export default observer(themed('NumberInput', NumberInputButtons))
