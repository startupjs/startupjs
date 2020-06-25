import React, { useState, useMemo, useLayoutEffect, useRef } from 'react'
import { observer, useDidUpdate } from 'startupjs'
import { TextInput, Platform } from 'react-native'
import Div from './../../Div'
import config from './../../../config/rootConfig'
import Icon from './../../Icon'
import './index.styl'

const IS_WEB = Platform.OS === 'web'
const IS_ANDROID = Platform.OS === 'android'
const IS_IOS = Platform.OS === 'ios'
const DARK_LIGHTER_COLOR = config.colors.darkLighter
const { caretColor, height, lineHeight, borderWidth } = config.TextInput

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

  const inputStyle = {
    paddingTop: verticalGutter,
    paddingBottom: verticalGutter,
    lineHeight: lH
  }

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
            color=DARK_LIGHTER_COLOR
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
