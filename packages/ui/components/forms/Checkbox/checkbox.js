import React, { useState, useRef } from 'react'
import { Animated, Easing } from 'react-native'
import { observer, useDidUpdate } from 'startupjs'
import config from '../../../config/rootConfig'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import Icon from './../../Icon'
import Div from './../../Div'
import './index.styl'

const AnimatedView = Animated.View

export default observer(function Checkbox ({
  style,
  className,
  value,
  disabled,
  onPress,
  ...props
}) {
  const animation = useRef(new Animated.Value(value ? 1 : 0)).current
  const [width, setWidth] = useState(0)

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
      animation.setValue(0)
    }
  }, [value])

  const checkedStyleName = { checked: value }

  return pug`
    Div.checkbox(
      style=style
      styleName=[checkedStyleName]
      accessibilityRole='checkbox'
      disabled=disabled
      onPress=onPress
      onLayout=(event) => setWidth(event.nativeEvent.layout.width)
      ...props
    )
      Icon.checkbox-icon(
        styleName=[checkedStyleName]
        icon=faCheck
        size='s'
        color=config.colors.white
      )
      AnimatedView.checkbox-animation(
        styleName=[checkedStyleName]
        style={
          transform: [{
            translateX: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, width]
            })
          }]
        }
      )
  `
})
