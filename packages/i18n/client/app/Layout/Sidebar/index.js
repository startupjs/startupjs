import React from 'react'
import { observer } from 'startupjs'
import { Br, Div, Hr, SmartSidebar } from '@startupjs/ui'
import Search from './Search'
import Types from './Types'
import Filters from './Filters'
import './index.styl'

export default observer(function i18nSidebar ({ children }) {
  function renderContent () {
    return pug`
      Div.sidebarContent
        Search
        Br
        Types
        Br(half)
        Hr
        Br(half)
        Filters
    `
  }

  return pug`
    SmartSidebar.root(
      sidebarStyleName='sidebar'
      renderContent=renderContent
      defaultOpen
    )
      = children
  `
})
