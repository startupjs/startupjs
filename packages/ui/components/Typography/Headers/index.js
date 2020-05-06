import React from 'react'
import { observer } from 'startupjs'
import { Platform } from 'react-native'
import Span from './../Span'

function generateTag (tag) {
  const header = observer(
    ({ children, style, ...props }) => {
      const isWeb = Platform.OS === 'web'
      const role = isWeb ? { accessibilityRole: 'heading', 'aria-level': tag.replace(/^h/, '') } : {}

      return pug`
        Span(
          style=style
          size=tag
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

export const H1 = generateTag('h1')
export const H2 = generateTag('h2')
export const H3 = generateTag('h3')
export const H4 = generateTag('h4')
export const H5 = generateTag('h5')
export const H6 = generateTag('h6')
