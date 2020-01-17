import React, { useRef, useLayoutEffect } from 'react'
import { observer, useSession, useComponentId } from 'startupjs'
import { ScrollView } from 'react-native'
import PropTypes from 'prop-types'
import DrawerLayout from 'react-native-drawer-layout-polyfill'
import config from '../../config/rootConfig'
import './index.styl'

function Drawer ({
  backgroundColor,
  children,
  path,
  position,
  width,
  renderContent = () => null,
  ...props
}) {
  const componentId = useComponentId()

  const [open, $open] = useSession(path || `Drawer.${componentId}`)
  let drawerRef = useRef()

  useLayoutEffect(() => {
    let drawer = drawerRef.current
    if (!drawer) return
    if (open) {
      drawer.openDrawer()
    } else {
      drawer.closeDrawer()
    }
  }, [!!open])

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
      ref=drawerRef
      renderNavigationView=_renderContent
      onDrawerClose=() => $open.setDiff(false)
      onDrawerOpen=() => $open.setDiff(true)
      ...props
    )= children
  `
}

Drawer.propTypes = {
  backgroundColor: PropTypes.string,
  position: PropTypes.oneOf(Object.values(DrawerLayout.positions)),
  width: PropTypes.number,
  renderContent: PropTypes.func.isRequired
}

Drawer.defaultProps = {
  backgroundColor: config.colors.white,
  position: 'left',
  width: 264
}

export default observer(Drawer)
