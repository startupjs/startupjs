// const NS_PATH = '_session.LeftSidebar'
// const BG = '#2F3135'
// const SIDEBAR_WIDTH = 240
// const MENU_WIDTH = 70
// const WIDTH = SIDEBAR_WIDTH + MENU_WIDTH
// const renderContent = () => {
//   return pug`
//     Text renderContent
//   `
// }

import React, { useRef, useMemo, useLayoutEffect } from 'react'
import { observer, useOn, useLocal, useValue, useSession } from 'startupjs'
import { View, ScrollView, Dimensions } from 'react-native'
import DrawerLayout from 'react-native-drawer-layout-polyfill'
import './index.styl'

const WIDTH = 310
const BG = '#F3F3F3'
const NS_PATH = '_session.Sidebar'
const DEFAULT_POSITION = 'left'
// Should be equal to $fixedLayoutBreakpoint variable
// TODO: get this value from css directly (like colors)
const FIXED_LAYOUT_BREAKPOINT = 400 + WIDTH * 2

const Sidebar = observer(({
  nsPath = NS_PATH,
  position = DEFAULT_POSITION,
  width = WIDTH,
  backgroundColor = BG,
  renderContent = () => null,
  children,
  onClose,
  onOpen,
  defaultOpen,
  ...props
}) => {
  let drawerRef = useRef()

  const [, $isFixedLayout] = useSession('isFixedLayout')

  let initialFixedLayout = useMemo(isFixedLayout, [])
  let [fixedLayout, $fixedLayout] = useValue(initialFixedLayout)

  const [isOpen, $isOpen] = useLocal(ns(nsPath, 'isOpen'))

  const _defaultOpen = useMemo(() => {
    return defaultOpen == null ? true : defaultOpen
  }, [])

  useMemo(() => {
    const isFixedLayout = !!fixedLayout
    if (isFixedLayout) {
      // when change dimensions from mobile
      // to desktop resolution or when rendering happen on desktop resolution
      // we open sidebar if it was opened on mobile resolution or default value
      $isOpen.setDiff(isOpen || _defaultOpen)
    } else {
      // when change dimensions from desktop
      // to mobile resolution or when rendering heppen for mobile resolution
      // we always close sidebars
      $isOpen.setDiff(isFixedLayout)
    }
    $isFixedLayout.setDiff(isFixedLayout)
  }, [!!fixedLayout])

  useLayoutEffect(() => {
    Dimensions.addEventListener('change', handleWidthChange)
    return () => Dimensions.removeEventListener('change', handleWidthChange)
  }, [])

  useOn('change', $isOpen, (value, prevValue) => {
    let drawer = drawerRef.current
    if (!drawer) return
    if (!!value === !!prevValue) return
    if (value) {
      drawer.openDrawer()
    } else {
      drawer.closeDrawer()
    }
  })

  function handleWidthChange () {
    $fixedLayout.setDiff(isFixedLayout())
  }

  const _renderContent = () => {
    return pug`
      ScrollView(contentContainerStyle={flex: 1})
        = renderContent()
    `
  }

  return pug`
    if fixedLayout
      FixedLayout.root(
        position=position
        width=width
        backgroundColor=backgroundColor
        isOpen=isOpen
        renderContent=_renderContent
      )= children
    else
      DrawerLayout.root(
        ...props
        drawerPosition=position
        drawerWidth=width
        drawerBackgroundColor=backgroundColor
        renderNavigationView=_renderContent
        onDrawerClose=() => {
          onClose && onClose()
          $isOpen.del()
        }
        onDrawerOpen=() => {
          onOpen && onOpen()
          $isOpen.setDiff(true)
        }
        ref=drawerRef
      )= children
  `
})

Sidebar.positions = DrawerLayout.positions

export default Sidebar

function ns (path, subpath) {
  if (subpath) return path + '.' + subpath
  return path
}

const FixedLayout = observer(({
  position,
  width,
  backgroundColor,
  children,
  isOpen,
  renderContent,
  ...props
}) => {
  let right = position !== DEFAULT_POSITION
  return pug`
    View.root(styleName={right})
      View.sidebar(
        styleName={isOpen}
        style={width, backgroundColor}
      )= renderContent()
      View.main= children
  `
})

function isFixedLayout () {
  let dim = Dimensions.get('window')
  return dim.width > FIXED_LAYOUT_BREAKPOINT
}
