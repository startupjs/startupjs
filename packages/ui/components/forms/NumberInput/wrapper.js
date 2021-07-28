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

function NumberInputWrapper ({
  style,
  buttonStyle,
  buttonsMode,
  size,
  disabled,
  children
}) {
  // const [active, setActive] = useState()
  //
  //   const increaseValue = () => {
  //     const currentValue = stringValue || 0
  //     const num = ((currentValue * coefficient + validStep * coefficient) / coefficient).toFixed(stepCount)
  //     const validNum = Math.min(num, validMax)
  //     setStringValue(validNum.toString())
  //     onChangeNumber && onChangeNumber(validNum)
  //   }
  //
  //   const decreaseValue = () => {
  //     const currentValue = stringValue || 0
  //     const num = ((currentValue * coefficient - validStep * coefficient) / coefficient).toFixed(stepCount)
  //     const validNum = Math.max(num, validMin)
  //     setStringValue(validNum.toString())
  //     onChangeNumber && onChangeNumber(validNum)
  //   }

  const buttonStyleNames = [buttonsMode]

  return pug`
    Div(style=style)
      = children
      if buttonsMode !== 'none'
        Button.input-button.increase(
          style=buttonStyle
          styleName=buttonStyleNames
          accessible=false
          color='darkLight'
          disabled=disabled
          icon=buttonsMode === 'horizontal' ? faPlus : faAngleUp
          size=size
          variant='outlined'
          onPress=() => {}
        )
        //- onPress=increaseValue
        Button.input-button.decrease(
          style=buttonStyle
          styleName=buttonStyleNames
          accessible=false
          color='darkLight'
          disabled=disabled
          icon=buttonsMode === 'horizontal' ? faMinus : faAngleDown
          size=size
          variant='outlined'
          onPress=() => {}
        )
        //- onPress=decreaseValue
  `
}

export default observer(themed('NumberInput', NumberInputWrapper))
