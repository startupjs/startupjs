import React from 'react'
import { Text } from 'react-native'
import { pug, observer } from 'startupjs'
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
  description,
  full,
  ...props
}) {
  if (variant && variant !== 'default') {
    if (variant === 'description') {
      console.warn("[@startupjs/ui] Span: variant='description' is DEPRECATED, use prop description instead.")
    } else {
      console.warn(`[@startupjs/ui] Span: variant='${variant}' is DEPRECATED, use font(${variant}) mixin instead.`)
    }
  }

  return pug`
    Text.root(
      style=style
      styleName=[theme, variant, { bold, italic, description, full }]
      ...props
    )= children
  `
}

Span.defaultProps = {
  bold: false,
  italic: false
}

Span.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  full: PropTypes.bool,
  bold: PropTypes.bool,
  italic: PropTypes.bool,
  description: PropTypes.bool
}

export default observer(themed('Span', Span))
