import React, { useRef } from 'react'
import { Animated, Easing } from 'react-native'
import { pug, observer, useDidUpdate } from 'startupjs'
import Div from './../../Div'
import themed from '../../../theming/themed'
import './index.styl'

const AnimatedView = Animated.View

function SwitchInput ({
  value,
  _hasError,
  ...props
}) {
  const animation = useRef(new Animated.Value(value ? 1 : 0)).current

  useDidUpdate(() => {
    if (value) {
      Animated.timing(
        animation,
        {
          toValue: 1,
          duration: 120,
          easing: Easing.linear,
          useNativeDriver: true
        }
      ).start()
    } else {
      Animated.timing(
        animation,
        {
          toValue: 0,
          duration: 120,
          easing: Easing.linear,
          useNativeDriver: true
        }
      ).start()
    }
  }, [value])

  return pug`
    Div.switch(
      styleName=[{ checked: value, error: _hasError }]
      ...props
    )
      AnimatedView.switch-animation(
        style={
          transform: [{
            translateX: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 8]
            })
          }]
        }
      )
  `
}
export default observer(themed('Checkbox', SwitchInput))
