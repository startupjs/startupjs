import React from 'react'
import { observer } from 'startupjs'
import Div from './../Div'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import propTypes from 'prop-types'
import { u } from '../../config/helpers'
import './index.styl'

const SIZES = {
  xss: u(1.5),
  xs: u(2),
  s: u(2.5),
  m: u(3),
  l: u(4),
  xl: u(5),
  xxl: u(6)
}
const BASE = u(0.5)

const Icon = observer(({
  style,
  icon,
  color,
  size,
  width,
  height,
  ...props
}) => {
  if (!icon) return null
  const _size = SIZES[size] - 2 * BASE

  return pug`
    Div.root(style=[style, { padding: BASE }] ...props)
      FontAwesomeIcon(
        icon=icon
        color=color
        size=_size
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
