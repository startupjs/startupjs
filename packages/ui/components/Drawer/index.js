import React, { useRef } from 'react'
import { observer, useOn, useLocal } from 'startupjs'
import { ScrollView } from 'react-native'
import PropTypes from 'prop-types'
import DrawerLayout from 'react-native-drawer-layout-polyfill'
import config from './config'
import './index.styl'

function Drawer ({
  backgroundColor,
  children,
  defaultOpen,
  nsPath,
  position,
  width,
  onClose,
  onOpen,
  renderContent,
  ...props
}) {
  let drawerRef = useRef()

  const [, $isOpen] = useLocal(ns(nsPath, 'isOpen'))

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

  const _renderContent = () => {
    return pug`
      ScrollView(contentContainerStyle={flex: 1})
        = renderContent()
    `
  }
  return pug`
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
}

Drawer.propTypes = {
  backgroundColor: PropTypes.string,
  defaultOpen: PropTypes.bool,
  nsPath: PropTypes.string,
  position: PropTypes.oneOf(Object.values(DrawerLayout.positions)),
  width: PropTypes.number,
  renderContent: PropTypes.func.isRequired
}

Drawer.defaultProps = {
  backgroundColor: config.backgroundColor,
  defaultOpen: config.defaultOpen,
  nsPath: config.nsPath,
  position: config.position,
  width: config.width,
  renderContent: config.renderContent
}

export default observer(Drawer)

function ns (path, subpath) {
  if (subpath) return path + '.' + subpath
  return path
}
