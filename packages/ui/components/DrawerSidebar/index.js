import React, { useRef } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import DrawerLayout from 'react-native-drawer-layout-polyfill'
import { observer, useComponentId, useBind, useLocal, useDidUpdate } from 'startupjs'
import PropTypes from 'prop-types'
import STYLES from './index.styl'

const { colors } = STYLES

function DrawerSidebar ({
  style = [],
  forceClosed,
  defaultOpen,
  children,
  path,
  $open,
  position,
  width,
  renderContent,
  ...props
}) {
  if (path) {
    console.warn('[@startupjs/ui] Sidebar: path is DEPRECATED, use $open instead.')
  }

  const componentId = useComponentId()
  if (!$open) {
    [, $open] = useLocal(path || `_session.DrawerSidebar.${componentId}`)
  }

  let backgroundColor
  ;({ backgroundColor = colors.white, ...style } = StyleSheet.flatten(style))

  let open
  let onChange
  ;({ open, onChange } = useBind({
    $open,
    open,
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
    if (forceClosed && !open) return
    if (open && !forceClosed) {
      drawer.openDrawer()
    } else {
      drawer.closeDrawer()
    }
  }, [!!forceClosed, !!open])

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
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  $open: PropTypes.object,
  defaultOpen: PropTypes.bool,
  forceClosed: PropTypes.bool,
  position: PropTypes.oneOf(['left', 'right']),
  width: PropTypes.number,
  renderContent: PropTypes.func
}

export default observer(DrawerSidebar)
