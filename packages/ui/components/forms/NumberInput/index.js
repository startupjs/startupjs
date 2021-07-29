import React, { useState, useMemo } from 'react'
import { observer } from 'startupjs'
import pick from 'lodash/pick'
import PropTypes from 'prop-types'
import TextInput from '../TextInput'
import Buttons from './Buttons'
import './index.styl'

function NumberInput ({
  buttonStyle,
  value,
  size,
  buttonsMode,
  disabled,
  max,
  min,
  step,
  onChangeNumber,
  ...props
}, ref) {
  const initialValue = useMemo(() => {
    return value && typeof value === 'number'
      ? value.toString()
      : ''
  }, [])
  const [inputValue, setInputValue] = useState(initialValue)
  const isStepInteger = useMemo(() => {
    return Number.isInteger(step)
  }, [step])
  const regexp = useMemo(() => {
    return isStepInteger
      ? /^-?\d*$/
      : /^(-?\d*)(\.\d*)?$/
  }, [isStepInteger])

  function onChangeText (newValue) {
    if (min && newValue < min) {
      // display tip - must be less then min
      return
    }

    if (max && newValue > max) {
      // display tip - must be greater then max
      return
    }

    if (!regexp.test(newValue)) return

    setInputValue(newValue)

    newValue = newValue && !isNaN(newValue)
      ? Number(newValue)
      : undefined

    // prevent update for the same values
    // for example
    // when add dot (values NUMBER and NUMBER. are the same)
    // when add -
    // when change value from -NUMBER to -
    if (newValue === value) return

    onChangeNumber && onChangeNumber(newValue)
  }

  function onIncrement (byNumber) {
    const newValue = (value || 0) + byNumber
    onChangeText(newValue)
  }

  function renderWrapper ({ style }, children) {
    return pug`
      Buttons(
        style=style
        buttonStyle=buttonStyle
        mode=buttonsMode
        size=size
        disabled=disabled
        onIncrement=onIncrement
      )= children
    `
  }

  return pug`
    TextInput(
      ref=ref
      test='number'
      inputStyleName=['input-input', buttonsMode, size]
      value=inputValue
      size=size
      disabled=disabled
      keyboardType='numeric'
      onChangeText=onChangeText
      _renderWrapper=renderWrapper
      ...props
    )
  `
}

NumberInput.defaultProps = {
  ...pick(
    TextInput.defaultProps,
    [
      'size',
      'disabled',
      'readonly'
    ]
  ),
  buttonsMode: 'vertical',
  step: 1
}

NumberInput.propTypes = {
  ...pick(
    TextInput.propTypes,
    [
      'style',
      'inputStyle',
      'placeholder',
      'value',
      'size',
      'disabled',
      'readonly',
      'onFocus',
      'onBlur',
      '_hasError'
    ]
  ),
  buttonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  buttonsMode: PropTypes.oneOf(['none', 'horizontal', 'vertical']),
  max: PropTypes.number,
  min: PropTypes.number,
  step: PropTypes.number,
  onChangeNumber: PropTypes.func
}

export default observer(
  NumberInput,
  { forwardRef: true }
)
