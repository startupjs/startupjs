import React, { useState, useMemo, useLayoutEffect, useRef, useEffect } from 'react'
import { Platform, StyleSheet, TextInput, View } from 'react-native'
import { observer } from 'startupjs'
import { faAngleDown, faAngleUp, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import toFinite from 'lodash/toFinite'
import cloneDeep from 'lodash/cloneDeep'
import { colorToRGBA } from '../../../helpers'
import Button from '../../Button'
import STYLES from './index.styl'

const {
  config: { caretColor, height, lineHeight, borderWidth },
  colors
} = STYLES

const IS_WEB = Platform.OS === 'web'
const IS_ANDROID = Platform.OS === 'android'
const IS_IOS = Platform.OS === 'ios'
const DARK_LIGHTER_COLOR = colorToRGBA(colors.dark, 0.25)

// TODO: Remove correction when issue will be fixed
// https://github.com/facebook/react-native/issues/28012
const IOS_LH_CORRECTION = {
  l: 4,
  m: 2,
  s: 2
}

export default observer(function Input ({
  style,
  inputStyle,
  buttons,
  disabled,
  focused,
  max,
  min,
  placeholder,
  size,
  step,
  value,
  onBlur,
  onChange,
  onChangeNumber,
  onFocus
}) {
  const inputRef = useRef()
  const [stringValue, setStringValue] = useState()
  const [active, setActive] = useState('')

  useEffect(() => {
    if (
      !isNaN(value) &&
      typeof value === 'number' &&
      stringValue !== '-' &&
      stringValue !== '' &&
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
      typeof onChangeNumber === 'function' && onChangeNumber(toFinite(newValue))
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
    typeof onChangeNumber === 'function' && onChangeNumber(validNum)
  }

  const decreaseValue = () => {
    const currentValue = stringValue || 0
    const num = ((currentValue * coefficient - validStep * coefficient) / coefficient).toFixed(stepCount)
    const validNum = Math.max(num, validMin)
    setStringValue(validNum.toString())
    typeof onChangeNumber === 'function' && onChangeNumber(validNum)
  }

  if (IS_WEB) {
    // repeat mobile behaviour on the web
    useLayoutEffect(() => {
      if (focused && disabled) inputRef.current.blur()
    }, [disabled])
    // fix minWidth on web
    // ref: https://stackoverflow.com/a/29990524/1930491
    useLayoutEffect(() => {
      inputRef.current.setNativeProps({ size: '1' })
    })
  }

  const [lH, verticalGutter] = useMemo(() => {
    const lH = lineHeight[size]
    const h = height[size]
    return [lH, (h - lH) / 2 - borderWidth]
  }, [size])

  const fullHeight = useMemo(() => {
    return lH + 2 * (verticalGutter + borderWidth)
  }, [lH, verticalGutter])

  style = StyleSheet.flatten([{ height: fullHeight }, style])

  inputStyle = StyleSheet.flatten([
    {
      paddingTop: verticalGutter,
      paddingBottom: verticalGutter,
      lineHeight: lH
    },
    inputStyle
  ])

  // tested rn 0.61.5 - does not work
  // https://github.com/facebook/react-native/issues/10712
  if (IS_IOS) inputStyle.lineHeight -= IOS_LH_CORRECTION[size]

  const inputExtraProps = {}
  if (IS_ANDROID) inputExtraProps.textAlignVertical = 'top'
  if (typeof onChange === 'function') inputExtraProps.onChange = _onChange

  const inputStyleName = [size, buttons, { disabled, focused }]

  return pug`
    View(style=style)
      TextInput.input-input(
        ref=inputRef
        style=inputStyle
        styleName=[inputStyleName]
        editable=!disabled
        keyboardType='numeric'
        placeholder=placeholder
        placeholderTextColor=DARK_LIGHTER_COLOR
        selectionColor=caretColor
        value=stringValue ? stringValue : ''
        onBlur=onBlur
        onChangeText=onChangeText
        onFocus=onFocus
        ...inputExtraProps
      )
      if buttons !== 'none'
        Button.input-button.up(
          styleName=[inputStyleName]
          variant='outlined'
          color= active === 'up' ? 'primary' : 'darkLight'
          size=size
          icon= buttons === 'horizontal' ? faPlus : faAngleUp
          disabled=disabled
          onPress=increaseValue
          onPressIn= () => setActive('up')
          onPressOut= () => setActive('')
          onMouseEnter= () => setActive('up')
          onMouseLeave= () => setActive('')
        )
        Button.input-button.down(
          styleName=[inputStyleName]
          variant='outlined'
          color= active === 'down' ? 'primary' : 'darkLight'
          size=size
          icon= buttons === 'horizontal' ? faMinus : faAngleDown
          disabled=disabled
          onPress=decreaseValue
          onPressIn= () => setActive('down')
          onPressOut= () => setActive('')
          onMouseEnter= () => setActive('down')
          onMouseLeave= () => setActive('')
        )
  `
})
