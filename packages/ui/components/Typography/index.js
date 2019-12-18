import React from 'react'
import { Text, Platform } from 'react-native'
import { observer } from 'startupjs'
import './index.styl'

function generateTag (tag, ariaLevelNumber) {
  return observer(
    ({ bold, children, style, ...props }) => {
      const isWeb = Platform.OS === 'web'
      const role = isWeb && ariaLevelNumber ? { accessibilityRole: 'heading', 'aria-level': ariaLevelNumber } : {}

      return pug`
        Text.root(
          styleName=[tag, { bold }]
          style=style
          ...role
          ...props
        )= children
      `
    }
  )
}

export const H1 = generateTag('h1', 1)
export const H2 = generateTag('h2', 2)
export const H3 = generateTag('h3', 3)
export const H4 = generateTag('h4', 4)
export const H5 = generateTag('h5', 5)
export const H6 = generateTag('h6', 6)
export const Span = generateTag('normal')
export const Description = generateTag('description')
export const Small = generateTag('small')
