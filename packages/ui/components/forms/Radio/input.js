import React, { useState } from 'react'
import { TouchableOpacity, Animated, Platform } from 'react-native'
import { observer, useDidUpdate } from 'startupjs'
import propTypes from 'prop-types'
import InputWrapper from '../InputWrapper'
import Div from '../../Div'
import Span from '../../Span'
import './index.styl'

const isWeb = Platform.OS === 'web'
const ANIMATION_TIMING = 120

const Input = function ({
  children,
  color,
  textColor,
  value,
  label,
  checked,
  onPress,
  ...props
}) {
  const {
    onMouseEnter,
    onMouseLeave,
    onPressIn,
    onPressOut
  } = props
  const [hover, setHover] = useState()
  const [active, setActive] = useState()
  const handlers = {
    onPressIn: (...args) => {
      setActive(true)
      onPressIn && onPressIn(...args)
    },
    onPressOut: (...args) => {
      setActive()
      onPressOut && onPressOut(...args)
    }
  }
  const circleHandlers = { ...handlers }

  if (isWeb) {
    circleHandlers.onMouseEnter = (...args) => {
      setHover(true)
      onMouseEnter && onMouseEnter(...args)
    }
    circleHandlers.onMouseLeave = (...args) => {
      setHover()
      onMouseLeave && onMouseLeave(...args)
    }
  }

  const [checkedSize] = useState(new Animated.Value(checked ? 1 : 0))

  const setChecked = () => {
    onPress && onPress(value)
  }

  useDidUpdate(() => {
    if (checked) {
      Animated.timing(
        checkedSize,
        {
          toValue: 1,
          duration: ANIMATION_TIMING
        }
      ).start()
    } else {
      Animated.timing(
        checkedSize,
        {
          toValue: 0,
          duration: ANIMATION_TIMING
        }
      ).start()
    }
  }, [checked])

  return pug`
    Div.root(
      interactive=false
      onPress=setChecked
      accessible=false
      ...handlers
    )
      InputWrapper.wrapper(
        styleName={ 'with-label': !!label }
        hover=hover
        active=active
        checked=checked
        color=color
      )
        TouchableOpacity.circle(
          style={borderColor: color}
          activeOpacity=1
          onPress=setChecked
          ...circleHandlers
        )
          Animated.View.checked(
            style={
              backgroundColor: color,
              transform: [{
                scale: checkedSize
              }]
            }
          )
      Span.label(style={color: textColor})= label
  `
}

Input.propType = {
  checked: propTypes.bool
}

export default observer(Input)
