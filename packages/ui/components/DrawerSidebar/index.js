import React, { useRef } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import DrawerLayoutModule from 'react-native-drawer-layout-polyfill'
import {
  pug,
  observer,
  useComponentId,
  useBind,
  useLocal,
  useDidUpdate
} from 'startupjs'
import PropTypes from 'prop-types'
import themed from '../../theming/themed'
import STYLES from './index.styl'

const { colors } = STYLES

const DrawerLayout = DrawerLayoutModule.default || DrawerLayoutModule
if (!DrawerLayout) throw Error('> Can\'t load DrawerLayout module. Issues with bundling.')

let isEffectRunning

function DrawerSidebar ({
  style = [],
  children,
  path,
  $open,
  position,
  lazy,
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
    // eslint-disable-next-line react-hooks/rules-of-hooks
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

    isEffectRunning = true

    if (open) {
      drawer.openDrawer()
    } else {
      drawer.closeDrawer()
    }
  }, [!!open])

  const renderNavigationView = () => {
    const render = lazy ? open : true
    if (!render) return null
    return pug`
      ScrollView(contentContainerStyle={flex: 1})
        = renderContent && renderContent()
    `
  }

  // drawer callback's are scheduled and not called synchronously
  // and when the open state changes several times in a short period of time
  // these scheduled callback's can create an infinite loop
  function onDrawerCallback (open) {
    if (typeof isEffectRunning === 'undefined') onChange(open)
    isEffectRunning = undefined
  }

  return pug`
    DrawerLayout.root(
      style=style
      drawerPosition=position
      drawerWidth=width
      drawerBackgroundColor=backgroundColor
      ref=drawerRef
      renderNavigationView=renderNavigationView
      onDrawerClose=() => onDrawerCallback(false)
      onDrawerOpen=() => onDrawerCallback(true)
      drawerLockMode=disabled ? 'locked-closed' : undefined
      ...props
    )= children
  `
}

DrawerSidebar.defaultProps = {
  position: 'left',
  lazy: false,
  disabled: false,
  width: 264
}

DrawerSidebar.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  $open: PropTypes.object,
  position: PropTypes.oneOf(['left', 'right']),
  lazy: PropTypes.bool,
  disabled: PropTypes.bool,
  width: PropTypes.number,
  renderContent: PropTypes.func
}

export default observer(themed('DrawerSidebar', DrawerSidebar))
