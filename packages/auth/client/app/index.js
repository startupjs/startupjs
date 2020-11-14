import React from 'react'
import * as pages from './pages'
import getRoutes from '../../isomorphic'
import Layout from './Layout'

export default function initAuthApp ({ components }) {
  const routes = getRoutes(pages).map(item => {
    const Page = item.component
    item.component = () => {
      return pug`
        Page(components=components)
      `
    }
    return item
  })

  return { routes, Layout }
}
