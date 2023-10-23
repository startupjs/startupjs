import React from 'react'
import { Text } from 'react-native'
import { pug, observer, styl } from 'startupjs'
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

styl`
  // ----- CONFIG: $UI.Span

  $this = merge({
    color: $UI.colors.mainText,
    descriptionColor: $UI.colors.secondaryText
  }, $UI.Span, true)

  // ----- COMPONENT

  _variants = ('default' 'h1' 'h2' 'h3' 'h4' 'h5' 'h6' 'description') // H1-H6, description is DEPRECATED

  .root
    font()
    fontFamily('normal')
    color: $this.color

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
      color: $this.descriptionColor

    &.full
      flex: 1
`
