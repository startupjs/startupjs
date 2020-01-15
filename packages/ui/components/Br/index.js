import React from 'react'
import { observer } from 'startupjs'
import { Text } from 'react-native'
import PropTypes from 'prop-types'
import { u } from './../../config/helpers'
import './index.styl'
const LINE_HEIGHT = u(2)

function Br ({ half, lines }) {
  const height = half ? LINE_HEIGHT / 2 : LINE_HEIGHT * lines
  return pug`
    Text.root(style={height})
  `
}

Br.defaultProps = {
  half: false,
  lines: 1
}

Br.propTypes = {
  half: PropTypes.boolean,
  lines: PropTypes.number

}

export default observer(Br)
