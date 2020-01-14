import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import './index.styl'

const SIZES = {
  xs: 8,
  s: 16,
  m: 24,
  l: 32,
  xl: 40,
  xxl: 48
}

const Radio = function ({
  value,
  label,
  activeOpacity,
  checked,
  size,
  style,
  disable,
  onPress,
  children
}) {
  let wh = SIZES[size] || SIZES.s
  let whh = wh / 2
  let localChecked = checked

  const CircleIcon = ({ checked, disable }) => pug`
    View.circle(
      styleName={disable}
      style={
        borderRadius: whh,
        width: wh,
        height: wh
      }
    )
      if checked
        View.checked(
          styleName={disable}
          style={
            width: whh,
            height: whh,
            borderRadius: whh
          }
        )
  `

  const setChecked = () => {
    if (disable) return
    localChecked = true
    onPress && onPress(value)
  }

  return pug`
    TouchableOpacity.root(
      activeOpacity=activeOpacity
      style=style
      styleName={disable}
      onPress=setChecked
    )
      CircleIcon(checked=localChecked disable=disable)
      Text.label(styleName={disable})= label || children
  `
}

Radio.defaultProps = {
  activeOpacity: 0,
  size: 's'
}

Radio.propType = {
  label: PropTypes.string,
  checked: PropTypes.bool,
  size: PropTypes.oneOf(['xs', 's', 'm', 'l', 'xl', 'xxl']),
  aciteOpacity: PropTypes.number,
  disable: PropTypes.bool
}

export default observer(Radio)
