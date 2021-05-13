import React from 'react'
import { Platform } from 'react-native'
import { observer } from 'startupjs'
import Span from './Span'

export default function generateHeader (tag) {
  const header = observer(
    ({ children, style, ...props }) => {
      const isWeb = Platform.OS === 'web'
      const role = isWeb
        ? { accessibilityRole: 'heading', 'aria-level': tag.replace(/^h/, '') }
        : {}

      return pug`
        Span(
          style=style
          variant=tag
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
