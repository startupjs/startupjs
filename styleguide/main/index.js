import React from 'react'
import { SuccessRedirect } from '@startupjs/auth'
import getRoutes from './routes'
import * as pages from './pages'

export const Layout = ({ children }) => {
  return pug`
    SuccessRedirect
      = children
  `
}

export const routes = getRoutes(pages)
