import React from 'react'
import { ScrollableProvider } from '@startupjs/scrollable-anchors'

export default function Layout ({ children }) {
  return pug`
    ScrollableProvider
      = children
  `
}
