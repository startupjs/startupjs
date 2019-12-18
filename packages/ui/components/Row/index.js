import React from 'react'
import './index.styl'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import { observer } from 'startupjs'

const Row = observer(({
  align,
  vAlign,
  wrap,
  reverse,
  style,
  children,
  ...props
}) => {
  return pug`
    View.root(
      styleName=[align, 'v' + vAlign, { wrap, reverse }]
      style=style
      ...props
    )
      = children
  `
})

Row.propTypes = {
  wrap: PropTypes.bool,
  reverse: PropTypes.bool,
  align: PropTypes.oneOf(['center', 'right', 'around', 'between']),
  vAlign: PropTypes.oneOf(['center'])
}

export default Row
