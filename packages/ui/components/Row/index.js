import React from 'react'
import './index.styl'
import propTypes from 'prop-types'
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
  wrap: propTypes.bool,
  reverse: propTypes.bool,
  align: propTypes.oneOf(['center', 'right', 'around', 'between']),
  vAlign: propTypes.oneOf(['center'])
}

export default observer(Row)
