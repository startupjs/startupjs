import React, {
  useState,
  useMemo,
  useLayoutEffect,
  useRef,
  useImperativeHandle
} from 'react'
import { StyleSheet, TextInput, Platform } from 'react-native'
import { observer, useDidUpdate } from 'startupjs'
import { colorToRGBA } from '../../../helpers'
import Div from './../../Div'
import Icon from './../../Icon'
import themed from '../../../theming/themed'
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
  const [currentNumberOfLines, setCurrentNumberOfLines] = useState(numberOfLines)
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
    // TODO
    // test mobile device behaviour
    useLayoutEffect(() => {
      if (focused && disabled) inputRef.current.blur()
    }, [disabled])
    // fix minWidth on web
    // ref: https://stackoverflow.com/a/29990524/1930491
    useLayoutEffect(() => {
      inputRef.current.setNativeProps({ size: '1' })
    }, [])
  }

  useDidUpdate(() => {
    if (numberOfLines !== currentNumberOfLines) {
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

  // tested rn 0.61.5 - does not work
  // https://github.com/facebook/react-native/issues/10712
  if (IS_IOS) inputStyle.lineHeight -= IOS_LH_CORRECTION[size]

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
    style: [{ height: fullHeight }, style]
  }, pug`
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
      selectTextOnFocus=false
      onFocus=handleFocus
      onBlur=handleBlur
      ...props
      ...inputExtraProps
    )
    if icon
      Div.input-icon(
        accessible=false
        onLayout=onLayoutIcon
        styleName=[size, iconPosition]
        onPress=onIconPress
        pointerEvents=onIconPress ? undefined : 'none'
      )
        Icon(
          icon=icon
          style=iconStyle
          size=ICON_SIZES[size]
        )
    if secondaryIcon
      Div.input-icon(
        accessible=false
        onLayout=onLayoutIcon
        styleName=[size, getOppositePosition(iconPosition)]
        onPress=onSecondaryIconPress
        pointerEvents=onSecondaryIconPress ? undefined : 'none'
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
