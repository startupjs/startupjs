import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import { View } from 'react-native'
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

export default observer(Table)
