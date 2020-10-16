import React from 'react'
import propTypes from 'prop-types'
import { observer } from 'startupjs'
import Div from '../Div'
import './index.styl'

function Thead ({ style, children, bordered, ...props }) {
  return pug`
    Div(
      ...props
      style=[style]
      styleName=[{ bordered }]
    )= children
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
