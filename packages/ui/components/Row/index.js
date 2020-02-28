import React from 'react'
import './index.styl'
import propTypes from 'prop-types'
import Div from './../Div'
import { observer } from 'startupjs'
import config from '../../config/rootConfig'

const SHADOWS = config.shadows

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

Row.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  wrap: propTypes.bool,
  reverse: propTypes.bool,
  align: propTypes.oneOf(['center', 'right', 'around', 'between']),
  vAlign: propTypes.oneOf(['center']),
  // div props
  activeOpacity: propTypes.number,
  disabled: propTypes.bool,
  interactive: propTypes.bool,
  level: propTypes.oneOf(SHADOWS.map((key, index) => index)),
  onPress: propTypes.func
}

export default observer(Row)
