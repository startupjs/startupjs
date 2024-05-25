import React, { useRef } from 'react'
import { Animated, Easing, Platform } from 'react-native'
import { pug, observer, useDidUpdate } from 'startupjs'
import Div from '../../Div'
import Span from '../../typography/Span'
import themed from '../../../theming/themed'
import { parseValue } from './helpers'
import './index.styl'

const IS_ANDROID = Platform.OS === 'android'
const ANIMATION_TIMING = 100
// workaround for android
// https://github.com/facebook/react-native/issues/6278
const MIN_SCALE_RATIO = IS_ANDROID ? 0.1 : 0
const MAX_SCALE_RATIO = 1

const RadioInput = function ({
  style,
  value,
  description,
  children,
  checked,
  disabled,
  readonly,
  onChange,
  error
}) {
  const animation = useRef(
    new Animated.Value(checked ? MAX_SCALE_RATIO : MIN_SCALE_RATIO)
  ).current

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

  return pug`
    Div.input-input(
      style=style
      vAlign='center'
      disabled=disabled || readonly
      onPress=() => onChange && onChange(parseValue(value))
      accessibilityRole='radio'
      row
    )
      Div.radio(
        styleName=[{ checked, error }]
      )
        Animated.View.circle(
          style={ transform: [{ scale: animation }] }
          styleName={ error }
        )
      if children
        Div.container
          Span.label= children
          if description
            Span.description(description)= description
  `
}

export default observer(themed('Radio', RadioInput))
