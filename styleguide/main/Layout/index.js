import React from 'react'
import { pug } from 'startupjs'
import { ScrollableProvider } from '@startupjs/scrollable-anchors'

export default function Layout ({ children }) {
  return pug`
    ScrollableProvider
      = children
  `
}
