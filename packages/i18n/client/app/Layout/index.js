import React from 'react'
import { observer } from 'startupjs'
import { Layout as UILayout } from '@startupjs/ui'
import Sidebar from './Sidebar'

export default observer(function Layout ({ children }) {
  return pug`
    UILayout
      Sidebar
        = children
  `
})
