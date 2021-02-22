import React from 'react'
import getRoutes from './routes'
import * as pages from './pages'

export const Layout = ({ children }) => {
  return pug`
    = children
  `
}

export const routes = getRoutes(pages)
