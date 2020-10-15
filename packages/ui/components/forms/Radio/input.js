import React, { useRef } from 'react'
import { Animated, Easing, Platform } from 'react-native'
import { observer, useDidUpdate } from 'startupjs'
import Row from '../../Row'
import Div from '../../Div'
import Span from '../../typography/Span'
import './index.styl'

const IS_ANDROID = Platform.OS === 'android'
const ANIMATION_TIMING = 100
// workaround for android
// https://github.com/facebook/react-native/issues/6278
const MIN_SCALE_RATIO = IS_ANDROID ? 0.1 : 0
const MAX_SCALE_RATIO = 1

const Input = function ({
  style,
  value,
  children,
  checked,
  disabled,
  readOnly,
  onPress,
  ...props
}) {
  const animation = useRef(
    new Animated.Value(checked ? MAX_SCALE_RATIO : MIN_SCALE_RATIO)
  ).current

  const setChecked = () => {
    onPress && onPress(value)
  }

  useDidUpdate(() => {
    if (checked) {
      Animated.timing(
        animation,
        {
          toValue: MAX_SCALE_RATIO,
          duration: ANIMATION_TIMING,
          easing: Easing.linear,
          useNativeDriver: true
        }
      ).start()
    } else {
      Animated.timing(
        animation,
        {
          toValue: MIN_SCALE_RATIO,
          duration: ANIMATION_TIMING,
          easing: Easing.linear,
          useNativeDriver: true
        }
      ).start()
    }
  }, [checked])

  if (readOnly && checked) {
    return pug`
      if typeof children === 'string'
        Span= children
      else
        = children
    `
  } else if (readOnly && !checked) {
    return null
  }

  return pug`
    Row.root(
      style=style
      vAlign='center'
      disabled=disabled
      onPress=setChecked
    )
      Div.radio(
        styleName=[{ checked }]
      )
        Animated.View.circle(
          style={ transform: [{ scale: animation }] }
        )
      Div.container
        if typeof children === 'string'
          Span= children
        else
          = children
  `
}

export default observer(Input)
