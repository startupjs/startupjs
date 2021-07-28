// import React, { useEffect, useMemo, useState } from 'react'
import React from 'react'
// import { Platform } from 'react-native'
import { observer } from 'startupjs'
import pick from 'lodash/pick'
// import cloneDeep from 'lodash/cloneDeep'
// import toFinite from 'lodash/toFinite'
import PropTypes from 'prop-types'
import TextInput from '../TextInput'
import Wrapper from './wrapper'
import './index.styl'

// const IS_WEB = Platform.OS === 'web'

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
  // onChange,
  ...props
}, ref) {
  // const [stringValue, setStringValue] = useState()
  //
  // useEffect(() => {
  //   if (typeof value === 'undefined') value = ''
  //   if (
  //     !isNaN(value) &&
  //     (value === '' || typeof value === 'number') &&
  //     stringValue !== value.toString()
  //   ) {
  //     setStringValue(value.toString())
  //   }
  // }, [stringValue, value])
  //
  // const validStep = useMemo(() => {
  //   if (step === 1) return step
  //   const floatStepRegexp = /^0\.(\d0*)?1$/
  //   if (floatStepRegexp.test(String(step))) return step
  //   console.error(`[ui -> NumberInput] Wrong step provided: ${step}. Step 1 is used instead`)
  //   return 1
  // }, [step])
  //
  // const stepCount = useMemo(() => validStep === 1 ? 0 : String(validStep).length - 2, [validStep])
  //
  // const coefficient = useMemo(() => Math.pow(10, stepCount), [stepCount])
  //
  // const validMax = useMemo(() => {
  //   if (max * coefficient * 10 >= Number.MAX_SAFE_INTEGER) return max / coefficient / 10
  //   return max
  // }, [max, coefficient])
  //
  // const validMin = useMemo(() => {
  //   if (min * coefficient * 10 <= Number.MIN_SAFE_INTEGER) return min / coefficient / 10
  //   return min
  // }, [min, coefficient])
  //
  // const isValidValue = value => {
  //   const integerRegexp = /^-?\d*?$/
  //   const floatRegexp = new RegExp('^-?\\d*(\\.(\\d{0,' + stepCount + '})?)?$')
  //   let regexp = integerRegexp
  //   if (stepCount > 0) {
  //     regexp = floatRegexp
  //   }
  //   return regexp.test(value)
  // }
  //
  // const getValidValue = value => {
  //   if (isValidValue(value)) {
  //     let newValue = value
  //     if (newValue >= validMax) {
  //       newValue = validMax.toString()
  //     } else if (newValue <= validMin) {
  //       newValue = validMin.toString()
  //     }
  //     return newValue
  //   }
  //   return stringValue
  // }

  const onChangeText = value => {
    console.log('on change', value)
    if (value === '-') {
      console.log('empty value? not triggered? or triggered empty?')
      return
    }

    if (min && value < min) {
      // display tip - must be less then min
      return
    }

    if (max && value > max) {
      // display tip - must be greater then max
      return
    }

    if (step && value % step) {
      // display tip - must be a multiple of step
      return
    }

    onChangeNumber && onChangeNumber(value)
  }

  // const inputExtraProps = {}
  //
  // if (onChange) {
  //   inputExtraProps.onChange = event => {
  //     let newValue = ''
  //     if (IS_WEB) {
  //       newValue = getValidValue(event.target.value)
  //     } else {
  //       newValue = getValidValue(event.nativeEvent.text)
  //     }
  //     if (newValue !== stringValue) {
  //       const cloned = cloneDeep(event)
  //       IS_WEB ? (cloned.target.value = newValue) : (cloned.nativeEvent.text = newValue)
  //       onChange(cloned)
  //     }
  //   }
  // }

  function renderWrapper ({ style }, children) {
    return pug`
      Wrapper(
        style=style
        buttonStyle=buttonStyle
        buttonsMode=buttonsMode
        size=size
        disabled=disabled
      )= children
    `
  }

  return pug`
    TextInput(
      ref=ref
      test='number'
      inputStyleName=['input-input', buttonsMode, size]
      value=value
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
      'value',
      'layoutOptions',
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
      'label',
      'description',
      'layout',
      'layoutOptions',
      'error',
      'disabled',
      'readonly',
      'onFocus',
      'onBlur'
    ]
  ),
  buttonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  buttonsMode: PropTypes.oneOf(['none', 'horizontal', 'vertical']),
  max: PropTypes.number,
  min: PropTypes.number,
  step: PropTypes.number,
  // onChange: PropTypes.func,
  onChangeNumber: PropTypes.func
}

export default observer(
  NumberInput,
  { forwardRef: true }
)
