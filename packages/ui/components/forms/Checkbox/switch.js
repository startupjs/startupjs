import React, { useState } from 'react'
import { observer, useDidUpdate } from 'startupjs'
import { TouchableOpacity, Animated, Easing } from 'react-native'
import './index.styl'
const AnimatedView = Animated.View

export default observer(function Switch ({
  style,
  checked,
  focused,
  disabled,
  onBlur,
  onFocus,
  onChange
}) {
  const [position] = useState(new Animated.Value(checked ? 100 : 0))

  useDidUpdate(() => {
    if (checked) {
      Animated.timing(
        position,
        {
          toValue: 8,
          duration: 120,
          easing: Easing.linear
        }
      ).start()
    } else {
      position.setValue(8)
      Animated.timing(
        position,
        {
          toValue: 0.01,
          duration: 120,
          easing: Easing.linear
        }
      ).start()
    }
  }, [checked])

  return pug`
    TouchableOpacity.switch(
      style=style
      styleName=[{ checked, focused }]
      activeOpacity=1
      disabled=disabled
      onBlur=onBlur
      onFocus=onFocus
      onPress=onChange
    )
      AnimatedView.switchAnimated(style={left: position})
  `
})
