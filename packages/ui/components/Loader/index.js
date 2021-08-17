import React from 'react'
import { ActivityIndicator } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import themed from '../../theming/themed'
import STYLES from './index.styl'

const { colors } = STYLES
const SIZES = { s: 'small', m: 'large' }

function Loader ({ color, size }) {
  if (!colors[color]) console.error('Loader component: Color for color property is incorrect. Use colors from $UI.colors')

  return pug`
    ActivityIndicator(
      color=colors[color]
      size=SIZES[size]
    )
  `
}

Loader.defaultProps = {
  color: 'darkLight',
  size: 'm'
}

Loader.propTypes = {
  size: PropTypes.oneOf(['s', 'm']),
  color: PropTypes.oneOf(Object.keys(colors))
}

export default observer(themed('Loader', Loader))
