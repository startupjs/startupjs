import React from 'react'
import { Text } from 'react-native'
import { observer, styl } from 'startupjs'
import PropTypes from 'prop-types'
import themed from '../../../theming/themed'

function Span ({
  style,
  children,
  variant,
  bold,
  italic,
  theme,
  description,
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
      styleName=[theme, variant, { bold, italic, description }]
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
  bold: PropTypes.bool,
  italic: PropTypes.bool,
  description: PropTypes.bool
}

export default observer(themed(Span))

styl`
    _variants = ('default' 'h1' 'h2' 'h3' 'h4' 'h5' 'h6' 'description')
    _description = $UI.colors.secondaryText

    .root
      fontFamily('normal')

      for variant in _variants
        &.{variant}
          font(variant)

      &.bold
        fontFamily('normal', $UI.fontWeights.normalBold)

      &.italic
        fontFamily('normal', $UI.fontWeights.normal, italic)

      &.bold.italic
        fontFamily('normal', $UI.fontWeights.normalBold, italic)

      &.description
        color _description
  `
