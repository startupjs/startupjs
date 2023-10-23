import React from 'react'
import { View } from 'react-native'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import themed from '../../../theming/themed'
import './index.styl'

function Table ({ style, children }) {
  return pug`
    View.root(style=style)= children
  `
}

Table.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node
}

export default observer(themed('Table', Table))
