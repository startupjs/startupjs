import React, { useRef } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import DrawerLayoutModule from 'react-native-drawer-layout-polyfill'
import { observer, useComponentId, useBind, useLocal, useDidUpdate } from 'startupjs'
import PropTypes from 'prop-types'
import themed from '../../theming/themed'
import STYLES from './index.styl'

const { colors } = STYLES

const DrawerLayout = DrawerLayoutModule.default || DrawerLayoutModule
if (!DrawerLayout) throw Error('> Can\'t load DrawerLayout module. Issues with bundling.')

let isEffectCall

function DrawerSidebar ({
  style = [],
  children,
  path,
  $open,
  position,
  disabled,
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
    onChange
  }))

  let drawerRef = useRef()

  useDidUpdate(() => {
    if (disabled) return
    let drawer = drawerRef.current

    isEffectCall = true

    if (open) {
      drawer.openDrawer()
    } else {
      drawer.closeDrawer()
    }
  }, [!!open])

  const _renderContent = () => {
    return pug`
      ScrollView(contentContainerStyle={flex: 1})
        = renderContent && renderContent()
    `
  }

  // drawer callback's are scheduled and not called synchronously
  // and when the open state changes several times in a short period of time
  // these scheduled callback's can create an infinite loop
  function onDrawerCallback (open) {
    if (typeof isEffectCall === 'undefined') onChange(open)
    isEffectCall = undefined
  }

  return pug`
    DrawerLayout.root(
      style=style
      drawerPosition=position
      drawerWidth=width
      drawerBackgroundColor=backgroundColor
      ref=drawerRef
      renderNavigationView=_renderContent
      onDrawerClose=() => onDrawerCallback(false)
      onDrawerOpen=() => onDrawerCallback(true)
      drawerLockMode=disabled ? 'locked-closed' : undefined
      ...props
    )= children
  `
}

DrawerSidebar.defaultProps = {
  position: 'left',
  disabled: false,
  width: 264
}

DrawerSidebar.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  $open: PropTypes.object,
  position: PropTypes.oneOf(['left', 'right']),
  disabled: PropTypes.bool,
  width: PropTypes.number,
  renderContent: PropTypes.func
}

export default observer(themed('DrawerSidebar', DrawerSidebar))
