import React from 'react'
import { Platform } from 'react-native'
import { observer, styl } from 'startupjs'
import Span from './Span'

export default function generateHeader (tag) {
  styl`
    _variants = ('default' 'h1' 'h2' 'h3' 'h4' 'h5' 'h6' 'description')

    .root
      fontFamily('heading')

      for variant in _variants
        &.{variant}
          font(variant)

      &.bold
        fontFamily('heading', $UI.fontWeights.headingBold)

      &.italic
        fontFamily('heading', $UI.fontWeights.heading, italic)

      &.bold.italic
        fontFamily('heading', $UI.fontWeights.headingBold, italic)
  `

  const header = observer(
    ({ children, style, bold, italic, ...props }) => {
      const isWeb = Platform.OS === 'web'
      const role = isWeb
        ? { accessibilityRole: 'heading', 'aria-level': tag.replace(/^h/, '') }
        : {}

      return pug`
        Span.root(
          styleName=[tag, { bold, italic }]
          style=style
          ...role
          ...props
        )= children
      `
    }
  )

  header.defaultProps = {
    bold: Span.defaultProps.bold,
    italic: Span.defaultProps.italic
  }

  header.propTypes = {
    style: Span.propTypes.style,
    children: Span.propTypes.children,
    bold: Span.propTypes.bold,
    italic: Span.propTypes.italic
  }

  return header
}
