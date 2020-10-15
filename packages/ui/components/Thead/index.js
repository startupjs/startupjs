import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
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
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  bordered: PropTypes.bool
}

export default observer(Thead)
