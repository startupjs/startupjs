import React, { useMemo } from 'react'
import { observer } from 'startupjs'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import propTypes from 'prop-types'
import { u } from '../../config/helpers'
import config from '../../config/rootConfig'
import './index.styl'

const { colors } = config

const SIZES = {
  xs: u(1.25),
  s: u(1.5),
  m: u(2),
  l: u(3),
  xl: u(5),
  xxl: u(8)
}

const Icon = observer(({
  style,
  icon,
  color,
  size,
  ...props
}) => {
  if (!icon) return null

  const _size = useMemo(() => SIZES[size] || size, [size])
  const _color = useMemo(() => colors[color] || color, [color])

  if (typeof icon === 'function') {
    const CustomIcon = icon
    return pug`
      CustomIcon(
        style=style
        width=_size
        height=_size
        fill=_color
      )
    `
  }

  return pug`
    FontAwesomeIcon(
      style=style
      icon=icon
      color=_color
      size=_size
    )
  `
})

Icon.defaultProps = {
  size: 'm'
}

Icon.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  icon: propTypes.oneOfType([propTypes.object, propTypes.func]),
  color: propTypes.string,
  size: propTypes.oneOfType([
    propTypes.oneOf(Object.keys(SIZES)),
    propTypes.number
  ])
}

export default Icon
