import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import { Text } from 'react-native'
import './index.styl'

function Span ({
  children,
  style,
  variant,
  bold,
  italic,
  description,
  ...props
}) {
  return pug`
    Text.root(
      styleName=[variant, { bold, italic, description }]
      style=style
      ...props
    )= children
  `
}

Span.defaultProps = {
  variant: 'normal'
}

Span.propTypes = {
  variant: propTypes.oneOf(['normal', 'caption', 'small']),
  bold: propTypes.bool,
  italic: propTypes.bool,
  description: propTypes.bool,
  children: propTypes.node
}

export default observer(Span)
