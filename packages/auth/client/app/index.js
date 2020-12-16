import React from 'react'
import * as pages from './pages'
import { getAuthRoutes } from '../../isomorphic'
import Layout from './Layout'

export default function initAuthApp ({ localForms, socialButtons, captions, descriptions, logo }) {
  const routes = getAuthRoutes(pages).map(item => {
    const Page = item.component
    item.component = () => {
      return pug`
        Page(
          logo=logo
          captions=captions
          descriptions=descriptions
          localForms=localForms
          socialButtons=socialButtons
        )
      `
    }
    return item
  })

  return { routes, Layout }
}
