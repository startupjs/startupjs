import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import { Text } from 'react-native'
import themed from '../../../theming/themed'
import './index.styl'

function Span ({
  style,
  children,
  variant,
  bold,
  italic,
  description,
  theme,
  ...props
}) {
  return pug`
    Text.root(
      style=style
      styleName=[theme, variant, { bold, italic }]
      ...props
    )= children
  `
}

Span.defaultProps = {
  bold: false,
  italic: false,
  variant: 'default'
}

Span.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  variant: propTypes.oneOf([
    'default', 'description', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
  ]),
  bold: propTypes.bool,
  italic: propTypes.bool
}

export default observer(themed(Span))
