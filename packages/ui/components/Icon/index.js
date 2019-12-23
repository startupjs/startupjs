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
  size = 'm',
  color,
  width,
  height,
  style
}) => {
  return (
    <FontAwesomeIcon
      icon={type ? [type, name] : name}
      color={color}
      width={width || SIZES[size]}
      height={height || SIZES[size]}
      style={style}
    />
  )
})

Icon.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  color: PropTypes.string,
  style: PropTypes.object,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(Object.keys(SIZES))]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}

export default Icon
