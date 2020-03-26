import React, { useRef, useLayoutEffect } from 'react'
import { observer, useLocal, useComponentId } from 'startupjs'
import { ScrollView } from 'react-native'
import propTypes from 'prop-types'
import DrawerLayout from 'react-native-drawer-layout-polyfill'
import config from '../../config/rootConfig'
import './index.styl'

function Drawer ({
  style,
  forceClosed,
  backgroundColor,
  children,
  path,
  position,
  width,
  renderContent,
  ...props
}) {
  const componentId = useComponentId()
  let drawerExtraProps = {}
  if (forceClosed) {
    drawerExtraProps.drawerLockMode = 'locked-closed'
  }

  const [open, $open] = useLocal(path || `_session.Drawer.${componentId}`)
  let drawerRef = useRef()

  useLayoutEffect(() => {
    let drawer = drawerRef.current
    if (!drawer) return
    if (open && !forceClosed) {
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
      style=style
      drawerPosition=position
      drawerWidth=width
      drawerBackgroundColor=backgroundColor
      ref=drawerRef
      renderNavigationView=_renderContent
      onDrawerClose=() => $open.setDiff(false)
      onDrawerOpen=() => $open.setDiff(true)
      ...props
      ...drawerExtraProps
    )= children
  `
}

Drawer.defaultProps = {
  forceClosed: false,
  backgroundColor: config.colors.white,
  position: 'left',
  width: 264
}

Drawer.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  forceClosed: propTypes.bool,
  backgroundColor: propTypes.string,
  position: propTypes.oneOf(Object.values(DrawerLayout.positions)),
  width: propTypes.number,
  renderContent: propTypes.func
}

export default observer(Drawer)
