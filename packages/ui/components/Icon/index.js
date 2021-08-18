import React, { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { observer, u } from 'startupjs'
import PropTypes from 'prop-types'
import themed from '../../theming/themed'
import STYLES from './index.styl'

const {
  config: {
    color
  }
} = STYLES

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
  const _size = useMemo(() => SIZES[size] || size, [size])

  if (!icon) return null

  // Pass color as part of style to allow color override from the outside
  style = StyleSheet.flatten([{ color: color }, style])

  // TODO VITE fix custom svg
  if (typeof icon === 'function') {
    const CustomIcon = icon
    return pug`
      CustomIcon(
        style=style
        width=_size
        height=_size
        fill=style.color
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
