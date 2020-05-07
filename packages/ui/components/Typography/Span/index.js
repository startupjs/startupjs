import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import { Text } from 'react-native'
import themed from '../../../config/themed'
import './index.styl'

function Span ({
  style,
  children,
  size,
  bold,
  italic,
  description,
  theme,
  ...props
}) {
  return pug`
    Text.root(
      style=style
      styleName=[theme, size, { bold, italic, description }]
      ...props
    )= children
  `
}

Span.defaultProps = {
  size: 'm',
  bold: false,
  italic: false
}

Span.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  size: propTypes.oneOf([
    'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl', 'xxxxl', 'xxxxxl',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
  ]),
  bold: propTypes.bool,
  italic: propTypes.bool,
  description: propTypes.bool
}

export default observer(themed(Span))
