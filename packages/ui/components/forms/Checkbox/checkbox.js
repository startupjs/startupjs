import React, { useRef, useState } from 'react'
import { observer, useDidUpdate } from 'startupjs'
import { TouchableOpacity, Animated, Easing } from 'react-native'
import config from '../../../config/rootConfig'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import Icon from './../../Icon'
import './index.styl'

const AnimatedView = Animated.View

export default observer(function Checkbox ({
  style,
  checked,
  focused,
  disabled,
  onBlur,
  onFocus,
  onChange
}) {
  const inputRef = useRef()
  const [position] = useState(new Animated.Value(checked ? 100 : 0))

  useDidUpdate(() => {
    if (checked) {
      Animated.timing(
        position,
        {
          toValue: 100,
          duration: 120,
          easing: Easing.linear
        }
      ).start()
    } else {
      position.setValue(0)
    }
  }, [checked])

  const checkedStyles = { checked }

  return pug`
    TouchableOpacity.input(
      accessibilityRole='checkbox'
      ref=inputRef
      style=style
      styleName=[checkedStyles, { focused }]
      activeOpacity=1
      disabled=disabled
      onBlur=onBlur
      onFocus=onFocus
      onPress=onChange
    )
      Icon.icon(
        styleName=[checkedStyles]
        icon=faCheck
        size='xs'
        color=config.colors.white
      )
      AnimatedView.animated(
        styleName=[checkedStyles]
        style={
          left: position.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '1%']
          })
        }
      )
  `
})
