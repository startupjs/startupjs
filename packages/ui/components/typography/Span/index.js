import React from 'react'
import { Text } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import themed from '../../../theming/themed'
import './index.styl'

function Span ({
  style,
  children,
  variant,
  bold,
  italic,
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
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  variant: PropTypes.oneOf([
    'default', 'description', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
  ]),
  bold: PropTypes.bool,
  italic: PropTypes.bool
}

export default observer(themed(Span))
