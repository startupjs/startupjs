import React, { useRef, useLayoutEffect } from 'react'
import { observer } from 'startupjs'
import { ScrollView } from 'react-native'
import PropTypes from 'prop-types'
import DrawerLayout from 'react-native-drawer-layout-polyfill'
import config from './config'
import './index.styl'

function Drawer ({
  backgroundColor,
  children,
  isOpen,
  position,
  width,
  onClose,
  onOpen,
  renderContent = () => null,
  ...props
}) {
  let drawerRef = useRef()

  useLayoutEffect(() => {
    const drawer = drawerRef.current
    if (isOpen) {
      drawer.openDrawer()
    } else {
      drawer.closeDrawer()
    }
  }, [isOpen])

  const _renderContent = () => {
    return pug`
      ScrollView(contentContainerStyle={flex: 1})
        = renderContent()
    `
  }
  return pug`
    DrawerLayout.root(
      drawerPosition=position
      drawerWidth=width
      drawerBackgroundColor=backgroundColor
      renderNavigationView=_renderContent
      onDrawerClose=() => {
        onClose && onClose()
      }
      onDrawerOpen=() => {
        onOpen && onOpen()
      }
      ref=drawerRef
      ...props
    )= children
  `
}

Drawer.propTypes = {
  backgroundColor: PropTypes.string,
  isOpen: PropTypes.bool,
  position: PropTypes.oneOf(Object.values(DrawerLayout.positions)),
  width: PropTypes.number,
  renderContent: PropTypes.func.isRequired
}

Drawer.defaultProps = {
  backgroundColor: config.backgroundColor,
  position: config.position,
  width: config.width
}

export default observer(Drawer)
