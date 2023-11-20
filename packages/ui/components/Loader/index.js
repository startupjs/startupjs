import React from 'react'
import { ActivityIndicator } from 'react-native'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import Colors, { ColorValues } from '../CssVariables/Colors'
import themed from '../../theming/themed'
import useColors from '../../hooks/useColors'

const SIZES = { s: 'small', m: 'large' }

function Loader ({ color, size }) {
  const getColor = useColors()
  if (!getColor(color)) console.error('Loader component: Color for color property is incorrect. Use colors from Colors')

  return pug`
    ActivityIndicator(
      color=getColor(color)
      size=SIZES[size]
    )
  `
}

Loader.defaultProps = {
  color: Colors['text-description'],
  size: 'm'
}

Loader.propTypes = {
  size: PropTypes.oneOf(['s', 'm']),
  color: PropTypes.oneOf(ColorValues)
}

export default observer(themed('Loader', Loader))
