import React, { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { observer, u } from 'startupjs'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import propTypes from 'prop-types'
import STYLES from './index.styl'

const {
  config: {
    defaultColor
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
  if (!icon) return null

  const _size = useMemo(() => SIZES[size] || size, [size])

  // Pass color as part of style to allow color override from the outside
  style = StyleSheet.flatten([{ color: defaultColor }, style])

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
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  icon: propTypes.oneOfType([propTypes.object, propTypes.func]),
  size: propTypes.oneOfType([
    propTypes.oneOf(Object.keys(SIZES)),
    propTypes.number
  ])
}

export default observer(Icon)
