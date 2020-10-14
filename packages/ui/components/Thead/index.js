import React from 'react'
import propTypes from 'prop-types'
import { observer } from 'startupjs'
import { View } from 'react-native'
import './index.styl'

function Thead ({ style, children, bordered }) {
  return pug`
    View(style=[style] styleName=[{ bordered }])= children
  `
}

Thead.defaultProps = {
  bordered: true
}

Thead.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  bordered: propTypes.bool
}

export default observer(Thead)
