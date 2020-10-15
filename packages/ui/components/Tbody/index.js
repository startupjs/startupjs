import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import { View } from 'react-native'

function Tbody ({ style, children }) {
  return pug`
    View(style=style)= children
  `
}

Tbody.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node
}

export default observer(Tbody)
