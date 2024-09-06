// TODO
// Think about resize and numberOfLines properties, should they be removed?
// If not, think about to make them work
import React, {
  useState,
  useMemo,
  useRef,
  useImperativeHandle
} from 'react'
import { TextInput, Platform } from 'react-native'
import { pug, observer, useIsomorphicLayoutEffect, useDidUpdate } from 'startupjs'
import Div from './../../Div'
import Icon from './../../Icon'
import themed from '../../../theming/themed'
import { useColors } from '../../../hooks'
import STYLES from './index.styl'

const {
  config: {
    caretColor,
    heights
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

  const getColor = useColors()

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

  useIsomorphicLayoutEffect(() => {
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

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useIsomorphicLayoutEffect(() => {
      if (focused && disabled) {
        inputRef.current.blur()
        setFocused(false)
      }
    }, [disabled])
    // fix minWidth on web
    // ref: https://stackoverflow.com/a/29990524/1930491
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useIsomorphicLayoutEffect(() => {
      // TODO: looks like it's not available anymore on new versions of react-native-web
      inputRef.current?.setNativeProps?.({ size: '1' })
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

  const fullHeight = useMemo(() => {
    return currentNumberOfLines * heights[size]
  }, [currentNumberOfLines])

  function onLayoutIcon (e) {
    if (IS_WEB) {
      e.nativeEvent.target.childNodes[0].tabIndex = -1
      e.nativeEvent.target.childNodes[0].childNodes[0].tabIndex = -1
    }
  }

  const inputExtraProps = {}
  if (IS_ANDROID && multiline) inputExtraProps.textAlignVertical = 'top'

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
      part=['input', {
        inputIconLeft: icon && iconPosition === 'left',
        inputIconRight: icon && iconPosition === 'right'
      }]
      ref=inputRef
      styleName=inputStyleName
      selectionColor=caretColor
      placeholder=placeholder
      placeholderTextColor=getColor('text-placeholder')
      value=value
      disabled=IS_WEB ? disabled : undefined
      editable=IS_WEB ? undefined : !disabled
      multiline=multiline
      selectTextOnFocus=false
      onFocus=handleFocus
      onBlur=handleBlur
      ...props
      ...inputExtraProps
    )
    if icon
      Div.input-icon(
        focusable=false
        onLayout=onLayoutIcon
        styleName=[size, iconPosition]
        onPress=disabled ? undefined : onIconPress
        pointerEvents=onIconPress ? undefined : 'none'
      )
        Icon(
          part='icon'
          icon=icon
          size=ICON_SIZES[size]
        )
    if secondaryIcon
      Div.input-icon(
        focusable=false
        onLayout=onLayoutIcon
        styleName=[size, getOppositePosition(iconPosition)]
        onPress=disabled ? undefined : onSecondaryIconPress
        pointerEvents=onSecondaryIconPress ? undefined : 'none'
      )
        Icon(
          part='secondaryIcon'
          icon=secondaryIcon
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
