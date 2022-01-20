import React, { useEffect, useState, useMemo } from 'react'
import { observer } from 'startupjs'
import pick from 'lodash/pick'
import PropTypes from 'prop-types'
import TextInput from '../TextInput'
import Div from './../../Div'
import Row from './../../Row'
import Span from './../../typography/Span'
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
  units,
  unitsPosition,
  onChangeNumber,
  ...props
}, ref) {
  const [inputValue, setInputValue] = useState()

  const precision = useMemo(() => String(step).split('.')?.[1]?.length || 0, [step])

  const regexp = useMemo(() => {
    return precision > 0
      ? new RegExp('^-?\\d*(\\.(\\d{0,' + precision + '})?)?$')
      : /^-?\d*$/
  }, [precision])

  useEffect(() => {
    if (value == null) {
      setInputValue('')
      return
    }

    // TODO
    // Display a tip instead of permanently change a value
    if (!isNaN(value) && Number(inputValue) !== value) {
      if (min != null && value < min) {
        value = min
      } else if (max != null && value > max) {
        value = max
      }

      value = +value.toFixed(precision)

      setInputValue(String(value))
      onChangeNumber && onChangeNumber(value)
    }
  }, [value, min, max, precision, onChangeNumber])

  function onChangeText (newValue) {
    // replace comma with dot for some locales
    if (typeof newValue === 'string' && precision > 0) {
      newValue = newValue.replace(/,/g, '.')
    }

    if (!regexp.test(newValue)) return

    if ((min != null && newValue < min) || (max != null && newValue > max)) {
      // TODO: display tip?
      return
    }

    setInputValue(newValue)

    // first check for empty string and undefined
    // second check for '-' or '.', this will be NaN and therefore return undefined
    newValue = !newValue || isNaN(newValue)
      ? undefined
      : Number(newValue)

    // prevent update for the same values
    // for example
    // when add dot (values NUMBER and NUMBER. are the same)
    // when add -
    // when change value from -NUMBER to -
    if (newValue === value) return

    onChangeNumber && onChangeNumber(newValue)
  }

  function onIncrement (byNumber) {
    const newValue = +((value || 0) + byNumber * step).toFixed(precision)
    // we use string because this is the value for TextInput
    onChangeText(String(newValue))
  }

  function renderWrapper ({ style }, children) {
    return pug`
      Row.input(
        style=style
        styleName=[unitsPosition]
        vAlign='center'
      )
        if units
          Span.input-units(styleName=[size])= units
        Div.input-container(styleName=[unitsPosition])
          Buttons(
            buttonStyle=buttonStyle
            mode=buttonsMode
            size=size
            disabled=disabled
            onIncrement=onIncrement
          )
          = children
    `
  }

  return pug`
    TextInput(
      ref=ref
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
  step: 1,
  unitsPosition: 'left'
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
  units: PropTypes.string,
  unitsPosition: PropTypes.oneOf(['left', 'right']),
  onChangeNumber: PropTypes.func
}

export default observer(
  NumberInput,
  { forwardRef: true }
)
