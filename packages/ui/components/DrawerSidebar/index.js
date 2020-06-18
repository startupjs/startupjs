import React, { useRef } from 'react'
import { observer, useComponentId, useBind, useLocal, useDidUpdate } from 'startupjs'
import { ScrollView, StyleSheet } from 'react-native'
import propTypes from 'prop-types'
import DrawerLayout from 'react-native-drawer-layout-polyfill'
import config from '../../config/rootConfig'
import './index.styl'

function DrawerSidebar ({
  style,
  forceClosed,
  defaultOpen,
  backgroundColor,
  children,
  path,
  $path,
  position,
  width,
  renderContent,
  ...props
}) {
  if (path) {
    console.warn('[@startupjs/ui] Sidebar: path is DEPRECATED, use $path instead.')
  }

  if (/^#|rgb/.test(backgroundColor)) {
    console.warn('[@startupjs/ui] Sidebar:: Hex color for backgroundColor property is deprecated. Use style instead')
  }

  const componentId = useComponentId()
  if (!$path) {
    [, $path] = useLocal(path || `_session.DrawerSidebar.${componentId}`)
  }

  ;({ backgroundColor = config.colors.white, ...style } = StyleSheet.flatten([
    { backgroundColor: config.colors[backgroundColor] || backgroundColor },
    style
  ]))

  let isOpen
  let onChange
  ;({ isOpen, onChange } = useBind({
    $path,
    isOpen,
    onChange,
    default: defaultOpen
  }))

  let drawerExtraProps = {}
  if (forceClosed) {
    drawerExtraProps.drawerLockMode = 'locked-closed'
  }

  let drawerRef = useRef()

  useDidUpdate(() => {
    let drawer = drawerRef.current
    if (!drawer) return
    if (isOpen && !forceClosed) {
      drawer.openDrawer()
    } else {
      drawer.closeDrawer()
    }
  }, [!!forceClosed, !!isOpen])

  const _renderContent = () => {
    return pug`
      ScrollView(contentContainerStyle={flex: 1})
        = renderContent && renderContent()
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
      onDrawerClose=() => onChange(false)
      onDrawerOpen=() => onChange(true)
      ...props
      ...drawerExtraProps
    )= children
  `
}

DrawerSidebar.defaultProps = {
  defaultOpen: false,
  forceClosed: false,
  position: 'left',
  width: 264
}

DrawerSidebar.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  $path: propTypes.object,
  defaultOpen: propTypes.bool,
  forceClosed: propTypes.bool,
  position: propTypes.oneOf(Object.values(DrawerLayout.positions)),
  width: propTypes.number,
  renderContent: propTypes.func
}

export default observer(DrawerSidebar)
