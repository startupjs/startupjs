import React, { useState, useMemo, useLayoutEffect, useRef } from 'react'
import { observer, useDidUpdate } from 'startupjs'
import { View, TextInput, Platform } from 'react-native'
import config from './../../config/rootConfig'
import Icon from './../Icon'
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

export default observer(function Input ({
  style,
  placeholder,
  value,
  size,
  focused,
  disabled,
  resize,
  numberOfLines,
  icon,
  onBlur,
  onFocus,
  onChangeText,
  ...props
}) {
  const inputRef = useRef()
  const [currentNumberOfLines, setCurrentNumberOfLines] = useState(numberOfLines)

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

  const inputStyles = { lineHeight: lH }
  if (IS_IOS) inputStyles.lineHeight -= IOS_LH_CORRECTION[size]

  const inputExtraProps = {}
  if (IS_ANDROID) inputExtraProps.textAlignVertical = 'top'

  return pug`
    View.input-wrapper(style=[style, { height: fullHeight }])
      if icon
        View.input-icon(
          styleName=[size]
        )
          Icon(
            icon=icon
            color=DARK_LIGHTER_COLOR
            size=size
          )
      View.input(
        style={
          paddingTop: verticalGutter,
          paddingBottom: verticalGutter,
          borderWidth
        }
        styleName=[size, {disabled, focused, 'with-icon': icon}]
      )
        TextInput.input-input(
          ref=inputRef
          style=inputStyles
          styleName=[size]
          selectionColor=caretColor
          placeholder=placeholder
          placeholderTextColor=DARK_LIGHTER_COLOR
          value=value
          editable=!disabled
          multiline=multiline
          onBlur=onBlur
          onFocus=onFocus
          onChangeText=(value) => {
            if (resize) {
              const numberOfLinesInValue = value.split('\n').length
              if (numberOfLinesInValue > numberOfLines) {
                setCurrentNumberOfLines(numberOfLinesInValue)
              }
            }
            onChangeText && onChangeText(value)
          }
          ...inputExtraProps
        )
  `
})
