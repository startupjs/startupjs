import React from 'react'
import { pug, observer, emit, useValue, useLocal } from 'startupjs'
import { Button, Div, H1, Layout, Menu, Row, SmartSidebar } from '@startupjs/ui'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import APP from '../../app.json'
import './index.styl'

const { displayName } = APP

const APP_NAME = displayName.charAt(0).toUpperCase() + displayName.slice(1)

const MenuItem = observer(({ url, children }) => {
  const [currentUrl] = useLocal('$render.url')
  return pug`
    Menu.Item(
      active=currentUrl === url
      onPress=() => emit('url', url)
    )= children
  `
})

export default observer(function ({ children }) {
  const [opened, $opened] = useValue(false)

  function renderSidebar () {
    return pug`
      Menu.sidebar-menu
        MenuItem(url='/') App
        MenuItem(url='/about') About
    `
  }

  return pug`
    Layout
      SmartSidebar.sidebar(
        $open=$opened
        renderContent=renderSidebar
      )
        Row.menu
          Button(color='secondaryText' icon=faBars onPress=() => $opened.set(!opened))
          H1.logo= APP_NAME

        Div.body= children
  `
})
