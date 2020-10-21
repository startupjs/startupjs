import React, { useState, useMemo, useLayoutEffect, useRef } from 'react'
import { observer, useDidUpdate } from 'startupjs'
import { TextInput, Platform } from 'react-native'
import { colorToRGBA } from '../../../helpers'
import Div from './../../Div'
import Icon from './../../Icon'
import STYLES from './index.styl'

const {
  config: {
    caretColor, height, lineHeight, borderWidth
  },
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

const ICON_SIZES = {
  s: 'm',
  m: 'm',
  l: 'l'
}

export default observer(function Input ({
  style,
  inputStyle,
  className,
  placeholder,
  value,
  size,
  focused,
  disabled,
  resize,
  numberOfLines,
  icon,
  iconPosition,
  iconStyle,
  onBlur,
  onFocus,
  onChangeText,
  onIconPress,
  renderWrapper,
  ...props
}) {
  const inputRef = useRef()
  const [currentNumberOfLines, setCurrentNumberOfLines] = useState(numberOfLines)

  if (!renderWrapper) {
    renderWrapper = ({ style }, children) => pug`
      Div(style=style)= children
    `
  }

  useLayoutEffect(() => {
    if (resize) {
      const numberOfLinesInValue = value.split('\n').length
      if (numberOfLinesInValue >= numberOfLines) {
        setCurrentNumberOfLines(numberOfLinesInValue)
      }
    }
  }, [value])

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

  useDidUpdate(() => {
    if (numberOfLines > currentNumberOfLines) {
      setCurrentNumberOfLines(numberOfLines)
    }
  }, [numberOfLines])

  const multiline = useMemo(() => {
    return resize || numberOfLines > 1
  }, [resize, numberOfLines])

  const [lH, verticalGutter] = useMemo(() => {
    const lH = lineHeight[size]
    const h = height[size]
    return [lH, (h - lH) / 2 - borderWidth]
  }, [size])

  const fullHeight = useMemo(() => {
    return currentNumberOfLines * lH + 2 * (verticalGutter + borderWidth)
  }, [currentNumberOfLines, lH, verticalGutter])

  inputStyle = [{
    paddingTop: verticalGutter,
    paddingBottom: verticalGutter,
    lineHeight: lH
  }, inputStyle]

  // tested rn 0.61.5 - does not work
  // https://github.com/facebook/react-native/issues/10712
  if (IS_IOS) inputStyle.lineHeight -= IOS_LH_CORRECTION[size]

  const inputExtraProps = {}
  if (IS_ANDROID) inputExtraProps.textAlignVertical = 'top'

  const inputStyleName = [
    size,
    { disabled, focused, [`icon-${iconPosition}`]: !!icon }
  ]

  return renderWrapper({
    style: [{ height: fullHeight }, style]
  }, pug`
    React.Fragment
      if icon
        Div.input-icon(
          styleName=[size, iconPosition]
          onPress=onIconPress
        )
          Icon(
            icon=icon
            style=iconStyle
            size=ICON_SIZES[size]
          )
      TextInput.input-input(
        ref=inputRef
        style=inputStyle
        styleName=[inputStyleName]
        selectionColor=caretColor
        placeholder=placeholder
        placeholderTextColor=DARK_LIGHTER_COLOR
        value=value
        editable=!disabled
        multiline=multiline
        onBlur=onBlur
        onFocus=onFocus
        onChangeText=(value) => {
          onChangeText && onChangeText(value)
        }
        ...props
        ...inputExtraProps
      )
  `)
})
