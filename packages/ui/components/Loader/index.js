import React from 'react'
import { observer } from 'startupjs'
import { ActivityIndicator } from 'react-native'
import propTypes from 'prop-types'
import STYLES from './index.styl'

const { colors } = STYLES
const SIZES = { s: 'small', m: 'large' }

function Loader ({ color, size }) {
  const _color = colors[color] || color

  return pug`
    ActivityIndicator(
      color=_color
      size=SIZES[size]
    )
  `
}

Loader.defaultProps = {
  color: colors.darkLight,
  size: 'm'
}

Loader.propTypes = {
  size: propTypes.oneOf(['s', 'm']),
  color: propTypes.string
}

export default observer(Loader)
