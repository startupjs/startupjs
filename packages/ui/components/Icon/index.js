import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'

const SIZES = {
  xs: 8,
  s: 16,
  m: 24,
  l: 32,
  xl: 40,
  xxl: 48
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
  if (!name) return null
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
