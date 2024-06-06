import React, { useEffect } from 'react'
import { Dimensions } from 'react-native'
import { pug, observer, $, useBind } from 'startupjs'
import PropTypes from 'prop-types'
import Sidebar from '../Sidebar'
import themed from '../../theming/themed'
import DrawerSidebar from '../DrawerSidebar'

const FIXED_LAYOUT_BREAKPOINT = 1024

function SmartSidebar ({
  style,
  sidebarStyle,
  defaultOpen,
  lazy,
  disabled,
  fixedLayoutBreakpoint,
  $open,
  position,
  width,
  children,
  renderContent,
  ...props
}) {
  if (!$open) $open = $()

  let open
  let onChange
  ;({ open, onChange } = useBind({ $open, open, onChange })) // eslint-disable-line prefer-const

  const $fixedLayout = $(isFixedLayout(fixedLayoutBreakpoint))
  const fixedLayout = $fixedLayout.get()

  useEffect(() => {
    if (!$fixedLayout.get()) return
    // or we can save open state before disabling
    // to open it with this state when enabling
    $open.set(defaultOpen)
  }, [disabled])

  useEffect(() => {
    if (disabled) return
    if ($fixedLayout.get()) {
      // when change dimensions from mobile
      // to desktop resolution or when rendering happen on desktop resolution
      // we open sidebar if it was opened on mobile resolution or default value
      $open.set(open || defaultOpen)
    } else {
      // when change dimensions from desktop
      // to mobile resolution or when rendering heppen for mobile resolution
      // we always close sidebars
      $open.set(false)
    }
  }, [$fixedLayout.get()])

  useEffect(() => {
    const listener = Dimensions.addEventListener('change', handleWidthChange)

    return () => {
      if (Dimensions.removeEventListener) {
        Dimensions.removeEventListener('change', handleWidthChange)
      } else {
        listener?.remove()
      }
    }
  }, [])

  function handleWidthChange () {
    $fixedLayout.set(isFixedLayout(fixedLayoutBreakpoint))
  }

  return pug`
    if fixedLayout
      Sidebar(
        style=style
        sidebarStyle=sidebarStyle
        $open=$open
        position=position
        width=width
        disabled=disabled
        renderContent=renderContent
        ...props
      )= children
    else
      DrawerSidebar(
        style=style
        $open=$open
        position=position
        width=width
        renderContent=renderContent
        disabled=disabled
        ...props
      )= children
  `
}

SmartSidebar.defaultProps = {
  defaultOpen: false,
  lazy: false,
  disabled: false,
  fixedLayoutBreakpoint: FIXED_LAYOUT_BREAKPOINT,
  position: 'left',
  width: 264
}

SmartSidebar.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  $open: PropTypes.any,
  defaultOpen: PropTypes.bool,
  lazy: PropTypes.bool,
  disabled: PropTypes.bool,
  fixedLayoutBreakpoint: PropTypes.number,
  position: PropTypes.oneOf(['left', 'right']),
  width: PropTypes.number,
  renderContent: PropTypes.func
}

export default observer(themed('SmartSidebar', SmartSidebar))

function isFixedLayout (fixedLayoutBreakpoint) {
  const dim = Dimensions.get('window')
  return dim.width > fixedLayoutBreakpoint
}
