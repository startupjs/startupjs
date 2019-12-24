import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
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
  name,
  type,
  size,
  color,
  width,
  height,
  style
}) => {
  return pug`
    FontAwesomeIcon(
      icon=type ? [type, name] : name
      color=color
      width=width || SIZES[size]
      height=height || SIZES[size]
      style=style
    )
  `
})

Icon.defaultProps = {
  size: 'm'
}

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  color: PropTypes.string,
  style: PropTypes.object,
  size: PropTypes.oneOf(Object.keys(SIZES)),
  width: PropTypes.number,
  height: PropTypes.number
}

export default Icon
