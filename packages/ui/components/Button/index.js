import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import './index.styl'

const Button = observer(({
  style,
  children,
  variant = 'flat', // shadowed, outlined, ghost
  size = 'normal', // large, big
  squared, // bool
  icon,
  disabled,
  onPress,
  ...props
}) => {
  let PressContainer = onPress ? TouchableOpacity : View

  return pug`
    PressContainer.root(
      onPress=disabled ? undefined : onPress
      activeOpacity=onPress && 1
      styleName=[variant, size, {
        squared,
        icon,
        disabled
      }]
      style=style
      ...props
    )
      if icon
        View.icon(style={width: 15, height: 15, backgroundColor: '#ffae00'})
      if children
        Text.text= children
  `
})

Button.propType = {
  variant: PropTypes.oneOf(['flat', 'shadowed', 'outlined', 'ghost']),
  size: PropTypes.oneOf(['normal', 'large', 'big']),
  squared: PropTypes.bool,
  disabled: PropTypes.bool
}

export default Button
