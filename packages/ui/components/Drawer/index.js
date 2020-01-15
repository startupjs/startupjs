import React, { useRef, useLayoutEffect } from 'react'
import { observer } from 'startupjs'
import { ScrollView } from 'react-native'
import PropTypes from 'prop-types'
import DrawerLayout from 'react-native-drawer-layout-polyfill'
import config from '../../config/rootConfig'
import './index.styl'

function Drawer ({
  backgroundColor,
  children,
  open,
  position,
  width,
  renderContent = () => null,
  ...props
}) {
  let drawerRef = useRef()

  useLayoutEffect(() => {
    const drawer = drawerRef.current
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
      ...props
    )= children
  `
}

Drawer.propTypes = {
  backgroundColor: PropTypes.string,
  open: PropTypes.bool,
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
