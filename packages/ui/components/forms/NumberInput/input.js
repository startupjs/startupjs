import React, { useState, useMemo, useLayoutEffect, useRef, useEffect } from 'react'
import { TextInput, Platform } from 'react-native'
import { observer } from 'startupjs'
import { faAngleDown, faAngleUp, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import toFinite from 'lodash/toFinite'
import cloneDeep from 'lodash/cloneDeep'
import { colorToRGBA } from '../../../helpers'
import Button from '../../Button'
import Div from '../../Div'
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
  className,
  placeholder,
  value,
  precision,
  step,
  min,
  max,
  size,
  buttons,
  focused,
  disabled,
  icon,
  iconStyle,
  onBlur,
  onFocus,
  onChangeNumber,
  onChange,
  onIconPress,
  renderWrapper,
  ...props
}) {
  const inputRef = useRef()
  const [stringValue, setStringValue] = useState()
  const [active, setActive] = useState()

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

  const coefficient = useMemo(() => Math.pow(10, precision), [precision])

  const validMax = useMemo(() => {
    if (max * coefficient >= Number.MAX_SAFE_INTEGER) return max / coefficient
    return max
  }, [max, coefficient])

  const validMin = useMemo(() => {
    if (min * coefficient <= Number.MIN_SAFE_INTEGER) return min / coefficient
    return min
  }, [min, coefficient])

  const validStep = useMemo(() => {
    const precisionValue = 1 / coefficient
    if (!step || step < precisionValue || step > validMax - validMin) {
      return precisionValue
    }
    return step
  }, [step, coefficient])

  const isValidValue = value => {
    let regexp = /^-?\d*?$/
    if (precision > 0) {
      regexp = new RegExp('^-?\\d*(\\.(\\d{0,' + precision + '})?)?$')
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
      onChangeNumber && onChangeNumber(toFinite(newValue))
    }
  }

  const onChangeHandler = event => {
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
    const num = (currentValue * coefficient + validStep * coefficient).toFixed(precision) / coefficient
    const validNum = Math.min(num, validMax)
    setStringValue(validNum.toString())
    onChangeNumber && onChangeNumber(validNum)
  }

  const decreaseValue = () => {
    const currentValue = stringValue || 0
    const num = (currentValue * coefficient - validStep * coefficient).toFixed(precision) / coefficient
    const validNum = Math.max(num, validMin)
    setStringValue(validNum.toString())
    onChangeNumber && onChangeNumber(validNum)
  }

  if (!renderWrapper) {
    renderWrapper = ({ style }, children) => pug`
      Div(style=style)= children
    `
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

  inputStyle = [
    {
      paddingTop: verticalGutter,
      paddingBottom: verticalGutter,
      lineHeight: lH
    },
    inputStyle
  ]

  // tested rn 0.61.5 - does not work
  // https://github.com/facebook/react-native/issues/10712
  if (IS_IOS) inputStyle.lineHeight -= IOS_LH_CORRECTION[size]

  const inputExtraProps = {}
  if (IS_ANDROID) inputExtraProps.textAlignVertical = 'top'
  if (onChange) inputExtraProps.onChange = onChangeHandler

  const inputStyleName = [size, buttons, { disabled, focused }]

  return renderWrapper(
    {
      style: [{ height: fullHeight }, style]
    },
    pug`
      React.Fragment
        TextInput.input-input(
          ref=inputRef
          style=inputStyle
          styleName=[inputStyleName]
          selectionColor=caretColor
          placeholder=placeholder
          placeholderTextColor=DARK_LIGHTER_COLOR
          value=stringValue ? stringValue : ''
          editable=!disabled
          keyboardType='numeric'
          onBlur=onBlur
          onFocus=onFocus
          onChangeText=onChangeText
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
            onPressOut= () => setActive()
            onMouseEnter= () => setActive('up')
            onMouseLeave= () => setActive()
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
            onPressOut= () => setActive()
            onMouseEnter= () => setActive('down')
            onMouseLeave= () => setActive()
          )
  `
  )
})
