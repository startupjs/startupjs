import React from 'react'
import propTypes from 'prop-types'
import { observer } from 'startupjs'
import { View } from 'react-native'
import './index.styl'

function Tr ({ style, children }) {
  return pug`
    View.root(style=style)= children
  `
}

Tr.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node
}

export default observer(Tr)
