import React, { useEffect, useState, useMemo } from 'react'
import { observer } from 'startupjs'
import pick from 'lodash/pick'
import PropTypes from 'prop-types'
import TextInput from '../TextInput'
import Buttons from './Buttons'
import './index.styl'

const NUM_REGEXP = /^(-?\d*)(\.\d*)?$/

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
  const [inputValue, setInputValue] = useState()

  useEffect(() => {
    if (typeof value === 'undefined') {
      setInputValue('')
      return
    }

    if (!isNaN(value) && Number(inputValue) !== value) {
      if (min && value < min) {
        value = min
      } else if (max && value > max) {
        value = max
      }
      setInputValue(value.toString())
    }
  }, [value, min, max])

  function onChangeText (newValue) {
    // replace comma with dot for some locales
    if (typeof newValue === 'string') newValue = newValue.replace(/,/g, '.')

    // if newValue from onIncrement function
    if (typeof newValue === 'number') newValue = String(newValue)

    if (!NUM_REGEXP.test(newValue)) return

    if ((min && newValue < min) || (max && newValue > max)) {
      // TODO: display tip?
      return
    }

    setInputValue(newValue)

    newValue = newValue && newValue !== '-'
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

  const precision = useMemo(() => String(step).split('.')?.[1]?.length || 0, [step])

  function onIncrement (byNumber) {
    const newValue = +((value || 0) + byNumber * step).toFixed(precision)
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
      'size',
      'disabled',
      'readonly',
      'onFocus',
      'onBlur',
      '_hasError'
    ]
  ),
  value: PropTypes.number,
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
