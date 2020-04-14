import React from 'react'
import { observer } from 'startupjs'
import { Layout } from '@startupjs/ui'
import Sidebar from './Sidebar'
import { MDXProvider } from '@startupjs/mdx'
import './index.styl'

export default observer(function StyleguideLayout ({ children }) {
  return pug`
    MDXProvider
      Layout.layout
        Sidebar
          = children
  `
})
