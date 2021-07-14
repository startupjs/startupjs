// import React, { useEffect, useMemo, useState } from 'react'
import React from 'react'
// import { Platform } from 'react-native'
import { observer } from 'startupjs'
import pick from 'lodash/pick'
// import cloneDeep from 'lodash/cloneDeep'
// import toFinite from 'lodash/toFinite'
import PropTypes from 'prop-types'
import TextInput from '../TextInput'
import themed from '../../../theming/themed'
// import Wrapper from './wrapper'
import './index.styl'

// const IS_WEB = Platform.OS === 'web'

function NumberInput ({
  buttonStyle,
  buttons,
  disabled,
  max,
  min,
  readonly,
  size,
  step,
  value,

  onChange,
  onChangeNumber,
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
    }

    if (value % step) {
      console.log('incorrect step')
      return
    }

    if (value < min) {
      console.log('less then min')
      return
    }
    if (value > max) {
      console.log('greater then max')
      return
    }

    // console.log(value)
    // const newValue = getValidValue(value)
    // console.log(value, 'value')
    // if (newValue !== stringValue) {
    //   setStringValue(newValue)
    //   const num = newValue === '' || newValue === '-' ? undefined : toFinite(newValue)
    //   onChangeNumber && onChangeNumber(num)
    // }
    onChangeNumber && onChangeNumber(value)
  }

  const inputExtraProps = {}
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
  //
  // const styleNames = [size, buttons, { disabled }]

  // function renderWrapper ({ style }, children) {
  //   return pug`
  //     Wrapper(
  //       style=style
  //       buttonStyle=buttonStyle
  //       size=size
  //       disabled=disabled
  //     )= children
  //   `
  // }

  return pug`
    //- inputStyleName=['input-input', ...styleNames]
    TextInput(
      ref=ref

      readonly=readonly
      value=value

      size=size
      disabled=disabled
      keyboardType='numeric'
      onChangeText=onChangeText
      ...props
      ...inputExtraProps
    )
    //- _renderWrapper=renderWrapper
  `
}

NumberInput.defaultProps = {
  ...pick(
    TextInput.defaultProps,
    [
      'size',
      'value',
      'disabled',
      'readonly'
    ]
  ),
  buttons: 'vertical',
  max: Number.MAX_SAFE_INTEGER,
  min: Number.MIN_SAFE_INTEGER,
  step: 1
}

NumberInput.propTypes = {
  ...pick(
    TextInput.propTypes,
    [
      'style',
      'wrapperStyle',
      'inputStyle',
      'label',
      'description',
      'layout',
      'options',
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
  buttons: PropTypes.oneOf(['none', 'horizontal', 'vertical']),
  max: PropTypes.number,
  min: PropTypes.number,
  step: PropTypes.number,
  onChange: PropTypes.func,
  onChangeNumber: PropTypes.func
}

export default observer(
  themed(NumberInput),
  { forwardRef: true }
)
