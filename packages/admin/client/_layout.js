import React, { useCallback, useMemo } from 'react'
import { pug, styl, observer, useValue$ } from 'startupjs'
import { Slot, SlotProvider, useRouter } from '@startupjs/router'
import { Menu, H1, SmartSidebar, Div, Button } from '@startupjs/ui'
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons/faTachometerAlt'
import MODULE from '../module'

const ADMIN_PATH = '/admin'

export default observer(function Layout () {
  const $sidebarOpened = useValue$()
  const router = useRouter()
  const pathname = router.usePathname()
  const adminPath = ADMIN_PATH // TODO: should be `router.basename`, but it's always '/' atm

  const menuItems = useMemo(() => [
    { name: 'Home', to: adminPath, icon: faTachometerAlt },
    ...MODULE.hook('menuItems').flat().map(item => ({
      ...item,
      to: item.to ? (adminPath + '/' + item.to) : undefined
    }))
  ], [adminPath])

  const renderSidebar = useCallback(() => pug`
    SlotProvider(name='sidebar')
      Menu.menu
        each item in menuItems
          Menu.Item(
            key=item.name
            active=pathname === item.to
            ...item
          )= item.name
  `, [])

  return pug`
    SmartSidebar.sidebar($open=$sidebarOpened defaultOpen renderContent=renderSidebar)
      Div.topbar(row vAlign='center')
        Div.left(row gap vAlign='center')
          Button(
            variant='text'
            color='text-description'
            icon=faBars
            onPress=() => $sidebarOpened.set(!$sidebarOpened.get())
          )
          H1.title Admin
        Div.right(row gap vAlign='center')
          MODULE.RenderHook(name='renderTopbarRight')
      Slot
  `

  styl`
    $topbarHeight = 6u

    .sidebar
      &:part(sidebar)
        border-right-width 1px
        border-right-color var(--color-border-main-strong-alt)

    .menu
      padding-top 2u

    .topbar
      background-color rgba(black, 0.02)
      height $topbarHeight
      z-index 1
      justify-content space-between
      padding 0 2u
      border-bottom-width 1px
      border-bottom-color var(--color-border-main-strong-alt)

    .title
      color var(--color-text-description)
      font(h5)
  `
})
