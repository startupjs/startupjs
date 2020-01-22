import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import { u } from '../../config/helpers'

const SIZES = {
  xs: u(1.5),
  s: u(2),
  m: u(3),
  l: u(4),
  xl: u(5),
  xxl: u(6)
}

const Icon = observer(({
  icon,
  size,
  color,
  width,
  height,
  style
}) => {
  return pug`
    FontAwesomeIcon(
      style=style
      icon=icon
      color=color
      width=width || SIZES[size]
      height=height || SIZES[size]
    )
  `
})

Icon.defaultProps = {
  size: 'm'
}

Icon.propTypes = {
  style: propTypes.object,
  color: propTypes.string,
  size: propTypes.oneOf(Object.keys(SIZES)),
  width: propTypes.number,
  height: propTypes.number
}

export default Icon
