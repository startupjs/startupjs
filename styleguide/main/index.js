import React from 'react'
import { SuccessRedirect } from '@startupjs/auth'
import { ScrollableProvider } from '@startupjs/scrollable-anchors'
import getRoutes from './routes'
import * as pages from './pages'

export const Layout = ({ children }) => {
  return pug`
    SuccessRedirect
      ScrollableProvider
        = children
  `
}

export const routes = getRoutes(pages)
