import React, { useRef } from 'react'
import { observer, useDidUpdate } from 'startupjs'
import { Animated, Easing } from 'react-native'
import Div from './../../Div'
import './index.styl'

const AnimatedView = Animated.View

export default observer(function Switch ({
  style,
  className,
  value,
  disabled,
  onPress,
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
      style=style
      styleName=[{ checked: value }]
      disabled=disabled
      onPress=onPress
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
})
