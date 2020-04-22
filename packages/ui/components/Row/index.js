import React from 'react'
import './index.styl'
import propTypes from 'prop-types'
import Div from './../Div'
import { observer } from 'startupjs'
import _omit from 'lodash/omit'

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
      style=style
      styleName=[align, 'v_' + vAlign, { wrap, reverse }]
      ...props
    )
      = children
  `
}

Row.defaultProps = {
  wrap: false,
  reverse: false,
  // div default props
  ...Div.defaultProps
}

Row.propTypes = {
  ..._omit(Div.propTypes, ['style', 'children']),
  wrap: propTypes.bool,
  reverse: propTypes.bool,
  align: propTypes.oneOf(['center', 'right', 'around', 'between']),
  vAlign: propTypes.oneOf(['center'])
}

export default observer(Row)
