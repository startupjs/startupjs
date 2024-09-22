import React from 'react'
import { pug, observer } from 'startupjs'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown'
import { faAngleUp } from '@fortawesome/free-solid-svg-icons/faAngleUp'
import { faMinus } from '@fortawesome/free-solid-svg-icons/faMinus'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
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
      )
  `
}

export default observer(themed('NumberInput', NumberInputButtons))
