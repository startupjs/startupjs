import React, {
  useState,
  useMemo,
  useLayoutEffect,
  useRef,
  useImperativeHandle
} from 'react'
import { StyleSheet, TextInput, Platform } from 'react-native'
import {
  pug,
  observer
  // useDidUpdate
} from 'startupjs'
import Div from './../../Div'
import Icon from './../../Icon'
import themed from '../../../theming/themed'
import STYLES from './index.styl'

const {
  config: {
    caretColor, heights, lineHeights, borderWidth, placeholderTextColor
  }
} = STYLES

const IS_WEB = Platform.OS === 'web'
const IS_ANDROID = Platform.OS === 'android'

const ICON_SIZES = {
  s: 'm',
  m: 'm',
  l: 'l'
}

function TextInputInput ({
  style,
  inputStyle,
  iconStyle,
  secondaryIconStyle,
  placeholder,
  value,
  size,
  disabled,
  resize,
  numberOfLines,
  icon,
  iconPosition,
  secondaryIcon,
  onFocus,
  onBlur,
  onIconPress,
  onSecondaryIconPress,
  _renderWrapper,
  _hasError,
  ...props
}, ref) {
  const [focused, setFocused] = useState(false)
  // const [currentNumberOfLines, setCurrentNumberOfLines] = useState(numberOfLines)
  const [currentNumberOfLines] = useState(numberOfLines)
  const inputRef = useRef()

  useImperativeHandle(ref, () => inputRef.current, [])

  function handleFocus (...args) {
    onFocus && onFocus(...args)
    setFocused(true)
  }
  function handleBlur (...args) {
    onBlur && onBlur(...args)
    setFocused(false)
  }

  if (!_renderWrapper) {
    _renderWrapper = ({ style }, children) => pug`
      Div(style=style)= children
    `
  }

  // useLayoutEffect(() => {
  //   if (resize) {
  //     const numberOfLinesInValue = value.split('\n').length
  //     if (numberOfLinesInValue >= numberOfLines) {
  //       setCurrentNumberOfLines(numberOfLinesInValue)
  //     }
  //   }
  // }, [value])

  if (IS_WEB) {
    // repeat mobile behaviour on the web
    // TODO
    // test mobile device behaviour

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLayoutEffect(() => {
      if (focused && disabled) {
        inputRef.current.blur()
        setFocused(false)
      }
    }, [disabled])
    // fix minWidth on web
    // ref: https://stackoverflow.com/a/29990524/1930491
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLayoutEffect(() => {
      inputRef.current?.setNativeProps({ size: '1' })
    }, [])
  }

  // useDidUpdate(() => {
  //   if (numberOfLines !== currentNumberOfLines) {
  //     setCurrentNumberOfLines(numberOfLines)
  //   }
  // }, [numberOfLines])

  const multiline = useMemo(() => {
    return resize || numberOfLines > 1
  }, [resize, numberOfLines])

  const [lH, verticalGutter] = useMemo(() => {
    const lH = lineHeights[size]
    const h = heights[size]
    return [lH, (h - lH) / 2 - borderWidth]
  }, [size])

  const fullHeight = useMemo(() => {
    return currentNumberOfLines * lH + 2 * (verticalGutter + borderWidth)
  }, [currentNumberOfLines, lH, verticalGutter])

  function onLayoutIcon (e) {
    if (IS_WEB) {
      e.nativeEvent.target.childNodes[0].tabIndex = -1
      e.nativeEvent.target.childNodes[0].childNodes[0].tabIndex = -1
    }
  }

  inputStyle = StyleSheet.flatten([{
    paddingTop: verticalGutter,
    paddingBottom: verticalGutter,
    lineHeight: lH
  }, inputStyle])

  const inputExtraProps = {}
  if (IS_ANDROID) inputExtraProps.textAlignVertical = 'top'

  const inputStyleName = [
    size,
    {
      disabled,
      focused,
      [`icon-${iconPosition}`]: !!icon,
      [`icon-${getOppositePosition(iconPosition)}`]: !!secondaryIcon,
      error: _hasError
    }
  ]

  return _renderWrapper({
    style: [
      { minHeight: fullHeight },
      style
    ]
  }, pug`
    TextInput.input-input(
      ref=inputRef
      style=inputStyle
      styleName=[inputStyleName]
      selectionColor=caretColor
      placeholder=placeholder
      placeholderTextColor=placeholderTextColor
      value=value
      disabled=IS_WEB ? disabled : undefined
      editable=IS_WEB ? undefined : !disabled
      numberOfLines=numberOfLines
      multiline=multiline
      selectTextOnFocus=false
      onFocus=handleFocus
      onBlur=handleBlur
      ...props
      ...inputExtraProps
    )
    if icon
      Div.input-icon(
        styleName=[size, iconPosition]
        disabled=disabled
        accessible=false
        pointerEvents=onIconPress ? undefined : 'none'
        onPress=onIconPress
        onLayout=onLayoutIcon
      )
        Icon(
          icon=icon
          style=iconStyle
          size=ICON_SIZES[size]
        )
    if secondaryIcon
      Div.input-icon(
        styleName=[size, getOppositePosition(iconPosition)]
        disabled=disabled
        accessible=false
        pointerEvents=onSecondaryIconPress ? undefined : 'none'
        onLayout=onLayoutIcon
        onPress=onSecondaryIconPress
      )
        Icon(
          icon=secondaryIcon
          style=secondaryIconStyle
          size=ICON_SIZES[size]
        )
  `)
}

function getOppositePosition (position) {
  return position === 'left' ? 'right' : 'left'
}

const ObservedInput = observer(
  themed('TextInput', TextInputInput),
  { forwardRef: true }
)

export default ObservedInput
