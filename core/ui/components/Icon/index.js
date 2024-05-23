import React, { useMemo } from 'react'
import { StyleSheet, Platform } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { pug, observer, u } from 'startupjs'
import PropTypes from 'prop-types'
import themed from '../../theming/themed'
import Colors from '../../theming/Colors'
import { useColors } from '../../hooks'

const SIZES = {
  xs: u(1),
  s: u(1.5),
  m: u(2),
  l: u(2.5),
  xl: u(3),
  xxl: u(3.5)
}

function Icon ({
  style,
  icon,
  size,
  ...props
}) {
  const getColor = useColors()
  const _size = useMemo(() => SIZES[size] || size, [size])

  if (!icon) return null

  style = StyleSheet.flatten([{ color: getColor(Colors['text-secondary']) }, style])

  if (typeof icon === 'function') {
    const CustomIcon = icon
    const { color: fill, width = _size, height = _size, ...iconStyle } = style

    return pug`
      CustomIcon(
        style=iconStyle
        width=width
        height=height
        fill=fill
      )
    `
  }

  if (Platform.OS === 'web') {
    style.width ??= _size
    style.height ??= _size
    style.outline ??= 'none'
    return pug`
      FontAwesomeIcon(
        style=style
        icon=icon
      )
    `
  }

  return pug`
    FontAwesomeIcon(
      style=style
      icon=icon
      size=_size
    )
  `
}

Icon.defaultProps = {
  size: 'm'
}

Icon.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
  size: PropTypes.oneOfType([
    PropTypes.oneOf(Object.keys(SIZES)),
    PropTypes.number
  ])
}

export default observer(themed('Icon', Icon))
