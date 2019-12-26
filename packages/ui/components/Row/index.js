import React from 'react'
import './index.styl'
import PropTypes from 'prop-types'
import Div from '../Div'
import { observer } from 'startupjs'

function Row ({
  style,
  children,
  align,
  vAlign,
  wrap,
  reverse,
  ...props
}) {
  return pug`
    Div.root(
      styleName=[align, 'v_' + vAlign, { wrap, reverse }]
      style=style
      ...props
    )
      = children
  `
}

Row.propTypes = {
  wrap: PropTypes.bool,
  reverse: PropTypes.bool,
  align: PropTypes.oneOf(['center', 'right', 'around', 'between']),
  vAlign: PropTypes.oneOf(['center'])
}

export default observer(Row)
