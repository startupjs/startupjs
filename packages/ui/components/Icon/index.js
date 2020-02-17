import React from 'react'
import { observer } from 'startupjs'
import { View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import propTypes from 'prop-types'
import { u } from '../../config/helpers'
import './index.styl'

const SIZES = {
  xss: u(0.5),
  xs: u(1),
  s: u(1.5),
  m: u(2),
  l: u(3),
  xl: u(4),
  xxl: u(5)
}

const Icon = observer(({
  style,
  icon,
  color,
  size,
  width,
  height
}) => {
  return pug`
    View.root(style=style)
      FontAwesomeIcon(
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
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  icon: propTypes.object,
  color: propTypes.string,
  size: propTypes.oneOf(Object.keys(SIZES)),
  width: propTypes.number,
  height: propTypes.number
}

export default Icon
