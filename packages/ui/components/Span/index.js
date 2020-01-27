import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import { Text } from 'react-native'
import useTheme from '../../config/useTheme'
import './index.styl'

function Span ({
  children,
  style,
  size,
  bold,
  italic,
  description,
  theme,
  ...props
}) {
  let [themed, Theme] = useTheme(theme)
  return pug`
    Theme
      Text.root(
        styleName=[themed(size, { bold, italic, description })]
        style=style
        ...props
      )= children
  `
}

Span.defaultProps = {
  size: 'm'
}

Span.propTypes = {
  size: propTypes.oneOf(['m', 's', 'xs']),
  bold: propTypes.bool,
  italic: propTypes.bool,
  description: propTypes.bool,
  children: propTypes.node
}

export default observer(Span)
