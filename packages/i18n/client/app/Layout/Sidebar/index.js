/* eslint-disable no-unreachable */
import React from 'react'
import { observer, styl } from 'startupjs'
import { Br, Div, SmartSidebar } from '@startupjs/ui'
import Search from './Search'
import Filters from './Filters'

export default observer(function i18nSidebar ({ children }) {
  function renderContent () {
    return pug`
      Div.sidebarContent
        Search
        Br
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

  styl`
    .root
      background-color #F5F6F7

      &:part(sidebar)
        border-right-width 1px
        border-right-color var(--colors-darkLighter, $UI.colors.darkLighter)

    .sidebarContent
      padding 2u
  `
})
