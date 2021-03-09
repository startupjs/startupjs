import React from 'react'
import { ScrollableProvider } from '@startupjs/scrollable-anchors'
import getRoutes from './routes'
import * as pages from './pages'

export const Layout = ({ children }) => {
  return pug`
    ScrollableProvider
      = children
  `
}

export const routes = getRoutes(pages)
