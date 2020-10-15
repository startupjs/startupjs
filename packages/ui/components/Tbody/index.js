import React from 'react'
import propTypes from 'prop-types'
import { observer } from 'startupjs'
import { View } from 'react-native'

function Tbody ({ style, children }) {
  return pug`
    View(style=style)= children
  `
}

Tbody.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node
}

export default observer(Tbody)
