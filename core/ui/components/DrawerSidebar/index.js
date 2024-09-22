import React, { useRef } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import DrawerLayoutModule from 'react-native-drawer-layout-polyfill'
import { pug, observer, useBind, $, useDidUpdate } from 'startupjs'
import PropTypes from 'prop-types'
import themed from '../../theming/themed'
import useColors from '../../hooks/useColors'

const DrawerLayout = DrawerLayoutModule.default || DrawerLayoutModule
if (!DrawerLayout) throw Error('> Can\'t load DrawerLayout module. Issues with bundling.')

let isEffectRunning

function DrawerSidebar ({
  style = [],
  children,
  $open,
  position,
  lazy,
  disabled,
  width,
  renderContent,
  ...props
}) {
  const getColor = useColors()

  if (!$open) $open = $()

  let backgroundColor
  // eslint-disable-next-line prefer-const
  ;({ backgroundColor = getColor('bg-main-strong'), ...style } = StyleSheet.flatten(style))

  let open
  let onChange
  // eslint-disable-next-line prefer-const
  ;({ open, onChange } = useBind({ $open, open, onChange }))

  const drawerRef = useRef()

  useDidUpdate(() => {
    if (disabled) return
    const drawer = drawerRef.current

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
  $open: PropTypes.any,
  position: PropTypes.oneOf(['left', 'right']),
  lazy: PropTypes.bool,
  disabled: PropTypes.bool,
  width: PropTypes.number,
  renderContent: PropTypes.func
}

export default observer(themed('DrawerSidebar', DrawerSidebar))
