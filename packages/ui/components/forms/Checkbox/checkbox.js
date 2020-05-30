import React, { useRef, useState } from 'react'
import { TouchableOpacity, Animated, Easing } from 'react-native'
import { observer, useDidUpdate } from 'startupjs'
import config from '../../../config/rootConfig'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import Icon from './../../Icon'
import InputWrapper from '../_helpers/InputWrapper'
import './index.styl'

const AnimatedView = Animated.View
const { colors } = config

export default observer(function Checkbox ({
  style,
  className,
  checked,
  focused,
  disabled,
  hover,
  active,
  onBlur,
  onFocus,
  onChange,
  ...props
}) {
  const inputRef = useRef()
  const [position] = useState(new Animated.Value(checked ? 100 : 0.01))

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
      position.setValue(0.01)
    }
  }, [checked])

  const checkedStyles = { checked }

  const color = checked || active ? colors.primary : colors.dark

  return pug`
    InputWrapper(style=style className=className hover=hover active=active checked=checked color=color)
      TouchableOpacity.input(
        accessibilityRole='checkbox'
        ref=inputRef
        styleName=[checkedStyles, { focused }]
        activeOpacity=1
        disabled=disabled
        onBlur=onBlur
        onFocus=onFocus
        onPress=onChange
        ...props
      )
        Icon.icon(
          styleName=[checkedStyles]
          icon=faCheck
          size='s'
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
