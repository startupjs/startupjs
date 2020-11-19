import React from 'react'
import { observer, useModel } from 'startupjs'
import { Layout, Row, Button, useMedia } from '@startupjs/ui'
import { MDXProvider } from '@startupjs/mdx'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import Sidebar, { SIDEBAR_PATH } from './Sidebar'
import './index.styl'

const Topbar = observer(function Topbar () {
  const $open = useModel(SIDEBAR_PATH)
  const media = useMedia()

  function toggleSidebar () {
    const open = $open.get()
    // special case, since by default it's closed on mobile, tablet
    // and opened on desktop and wide
    if (open == null) {
      const defaultOpen = media.desktop
      $open.set(!defaultOpen)
      return
    }
    $open.set(!$open.get())
  }

  return pug`
    Row.topbar
      Button(icon=faBars onPress=toggleSidebar color='darkLight')
  `
})

export default observer(function StyleguideLayout ({ children }) {
  // Note: Topbar height is compensated in PDoc
  //       to achieve a semi-transparent effect
  return pug`
    MDXProvider
      Layout.layout
        Sidebar
          Topbar
          = children
  `
})
