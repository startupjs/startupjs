import React from 'react'
import { observer, useModel } from 'startupjs'
import { Layout, Row, Button } from '@startupjs/ui'
import { MDXProvider } from '@startupjs/mdx'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import Sidebar, { SIDEBAR_PATH } from './Sidebar'
import './index.styl'

const Topbar = observer(function Topbar () {
  const $open = useModel(SIDEBAR_PATH)

  function toggleSidebar () {
    $open.set(!$open.get())
  }

  return pug`
    Row.topbar
      Button(testID='button' icon=faBars onPress=toggleSidebar color='darkLight')
  `
})

export default observer(function StyleguideLayout ({ children }) {
  // Note: Topbar height is compensated in PDoc
  //       to achieve a semi-transparent effect
  return pug`
    MDXProvider
      Layout.layout(testID="Layout")
        Sidebar
          Topbar
          = children
  `
})
