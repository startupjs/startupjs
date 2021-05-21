import React, { useEffect, useMemo, useState } from 'react'
import { Platform, View } from 'react-native'
import { observer } from 'startupjs'
import cloneDeep from 'lodash/cloneDeep'
import toFinite from 'lodash/toFinite'
import { faAngleDown, faAngleUp, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import TextInput from '../TextInput'
import Button from '../../Button'
import themed from '../../theming/themed'
import './index.styl'

const IS_WEB = Platform.OS === 'web'

function NumberInput ({
  style,
  buttonStyle,
  inputStyle,
  buttons,
  disabled,
  label,
  layout,
  max,
  min,
  placeholder,
  readonly,
  size,
  step,
  value,
  onBlur,
  onChange,
  onChangeNumber
}) {
  const [stringValue, setStringValue] = useState()
  const [active, setActive] = useState('')

  useEffect(() => {
    if (typeof value === 'undefined') value = ''
    if (
      !isNaN(value) &&
      (value === '' || typeof value === 'number') &&
      stringValue !== value.toString()
    ) {
      setStringValue(value.toString())
    }
  }, [value])

  const validStep = useMemo(() => {
    if (step === 1) return step
    const floatStepRegexp = /^0\.(\d0*)?1$/
    if (floatStepRegexp.test(String(step))) return step
    console.error(`[ui -> NumberInput] Wrong step provided: ${step}. Step 1 is used instead`)
    return 1
  }, [step])

  const stepCount = useMemo(() => validStep === 1 ? 0 : String(validStep).length - 2, [validStep])

  const coefficient = useMemo(() => Math.pow(10, stepCount), [stepCount])

  const validMax = useMemo(() => {
    if (max * coefficient * 10 >= Number.MAX_SAFE_INTEGER) return max / coefficient / 10
    return max
  }, [max, coefficient])

  const validMin = useMemo(() => {
    if (min * coefficient * 10 <= Number.MIN_SAFE_INTEGER) return min / coefficient / 10
    return min
  }, [min, coefficient])

  const isValidValue = value => {
    const integerRegexp = /^-?\d*?$/
    const floatRegexp = new RegExp('^-?\\d*(\\.(\\d{0,' + stepCount + '})?)?$')
    let regexp = integerRegexp
    if (stepCount > 0) {
      regexp = floatRegexp
    }
    return regexp.test(value)
  }

  const getValidValue = value => {
    if (isValidValue(value)) {
      let newValue = value
      if (newValue >= validMax) {
        newValue = validMax.toString()
      } else if (newValue <= validMin) {
        newValue = validMin.toString()
      }
      return newValue
    }
    return stringValue
  }

  const onChangeText = value => {
    const newValue = getValidValue(value)
    if (newValue !== stringValue) {
      setStringValue(newValue)
      const num = newValue === '' || newValue === '-' ? undefined : toFinite(newValue)
      onChangeNumber && onChangeNumber(num)
    }
  }

  const _onChange = event => {
    let newValue = ''
    if (IS_WEB) {
      newValue = getValidValue(event.target.value)
    } else {
      newValue = getValidValue(event.nativeEvent.text)
    }
    if (newValue !== stringValue) {
      const cloned = cloneDeep(event)
      IS_WEB ? (cloned.target.value = newValue) : (cloned.nativeEvent.text = newValue)
      onChange(cloned)
    }
  }

  const increaseValue = () => {
    const currentValue = stringValue || 0
    const num = ((currentValue * coefficient + validStep * coefficient) / coefficient).toFixed(stepCount)
    const validNum = Math.min(num, validMax)
    setStringValue(validNum.toString())
    onChangeNumber && onChangeNumber(validNum)
  }

  const decreaseValue = () => {
    const currentValue = stringValue || 0
    const num = ((currentValue * coefficient - validStep * coefficient) / coefficient).toFixed(stepCount)
    const validNum = Math.max(num, validMin)
    setStringValue(validNum.toString())
    onChangeNumber && onChangeNumber(validNum)
  }

  const inputExtraProps = {}
  if (onChange) inputExtraProps.onChange = _onChange

  const styleNames = [size, buttons, { disabled }]

  return pug`
    View(style=style)
      TextInput(
        inputStyle=inputStyle
        inputStyleName=['input-input', ...styleNames]
        disabled=disabled
        label=label
        layout=layout
        placeholder=placeholder
        size=size
        readonly=readonly
        keyboardType='numeric'
        value=stringValue ? stringValue : ''
        onChangeText=onChangeText
        ...inputExtraProps
      )
      if buttons !== 'none' && !readonly
        Button.input-button.up(
          styleName=[...styleNames]
          style=buttonStyle
          accessible=false
          color= active === 'up' ? 'primary' : 'darkLight'
          disabled=disabled
          icon= buttons === 'horizontal' ? faPlus : faAngleUp
          size=size
          variant='outlined'
          onPress=increaseValue
          onPressIn= () => setActive('up')
          onPressOut= () => setActive('')
          onMouseEnter= () => setActive('up')
          onMouseLeave= () => setActive('')
        )
        Button.input-button.down(
          styleName=[...styleNames]
          style=buttonStyle
          accessible=false
          color= active === 'down' ? 'primary' : 'darkLight'
          disabled=disabled
          icon= buttons === 'horizontal' ? faMinus : faAngleDown
          size=size
          variant='outlined'
          onPress=decreaseValue
          onPressIn= () => setActive('down')
          onPressOut= () => setActive('')
          onMouseEnter= () => setActive('down')
          onMouseLeave= () => setActive('')
        )
  `
}

NumberInput.defaultProps = {
  buttons: 'vertical',
  disabled: false,
  max: Number.MAX_SAFE_INTEGER,
  min: Number.MIN_SAFE_INTEGER,
  readonly: false,
  size: 'm',
  step: 1
}

NumberInput.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  buttonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  inputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  buttons: PropTypes.oneOf(['none', 'horizontal', 'vertical']),
  disabled: PropTypes.bool,
  label: PropTypes.string,
  layout: PropTypes.oneOf(['pure', 'rows']),
  max: PropTypes.number,
  min: PropTypes.number,
  placeholder: PropTypes.string,
  readonly: PropTypes.bool,
  size: PropTypes.oneOf(['l', 'm', 's']),
  step: PropTypes.number,
  value: PropTypes.number,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onChangeNumber: PropTypes.func,
  onFocus: PropTypes.func
}

export default observer(themed(NumberInput))
