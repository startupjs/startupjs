import React from 'react'
import { pug } from 'startupjs'
import { Layout as SLayout } from '@startupjs/ui'

export default function Layout ({ children }) {
  return pug`
    SLayout
      = children
  `
}
