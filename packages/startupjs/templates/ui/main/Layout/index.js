import React from 'react'
import { observer, emit, useValue, useLocal } from 'startupjs'
import './index.styl'
import { Row, Div, Layout, SmartSidebar, Menu, Button, H1, Span } from '@startupjs/ui'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { displayName } from '../../app.json'

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
      Menu.sidebar
        MenuItem(url='/') App
        MenuItem(url='/about') About
    `
  }

  return pug`
    Layout
      SmartSidebar(
        backgroundColor='#eeeeee'
        path=$opened.path()
        renderContent=renderSidebar
      )
        Row.menu
          Button(color='secondaryText' icon=faBars onPress=() => $opened.set(!opened))
          H1.logo
            Span.logoText(size='xl')= APP_NAME

        Div.body= children
  `
})
