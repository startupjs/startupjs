import React from 'react'
import { Text, Platform } from 'react-native'
import { observer } from 'startupjs'
import './index.styl'

function generateTag (tag) {
  return observer(
    ({ bold, children, style, ...props }) => {
      const isWeb = Platform.OS === 'web'
      const role = isWeb ? { accessibilityRole: 'heading', 'aria-level': tag.replace(/^h/, '') } : {}

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

export const H1 = generateTag('h1')
export const H2 = generateTag('h2')
export const H3 = generateTag('h3')
export const H4 = generateTag('h4')
export const H5 = generateTag('h5')
export const H6 = generateTag('h6')
