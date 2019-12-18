import React from 'react'
import './index.styl'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import { observer } from 'startupjs'

const Row = observer(({
  align,
  vAlign,
  wrap,
  style,
  children,
  ...props
}) => {
  const alignSubClass = align && align === vAlign ? 'fullCenter' : vAlign === 'center' ? 'vCenter' : align === 'center' ? 'hCenter' : ''
  return pug`
    View.root(
      styleName=[align, wrap, alignSubClass]
      style=style
      ...props
    )
      = children
  `
})

Row.propTypes = {
  wrap: PropTypes.bool,
  align: PropTypes.oneOf(['reverse', 'right', 'center', 'around', 'between']),
  vAlign: PropTypes.oneOf(['center'])
}

export default Row
