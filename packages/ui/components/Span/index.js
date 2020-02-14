import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import { Text } from 'react-native'
import themed from '../../config/themed'
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
  size: 'm'
}

Span.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  size: propTypes.oneOf(['xxl', 'xl', 'l', 'm', 's', 'xs']),
  bold: propTypes.bool,
  italic: propTypes.bool,
  description: propTypes.bool
}

export default observer(themed(Span))
