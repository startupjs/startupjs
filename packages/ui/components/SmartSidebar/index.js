import React, { useLayoutEffect } from 'react'
import { Dimensions } from 'react-native'
import {
  observer,
  useValue,
  useComponentId,
  useLocal,
  useBind
} from 'startupjs'
import PropTypes from 'prop-types'
import Sidebar from '../Sidebar'
import DrawerSidebar from '../DrawerSidebar'

const FIXED_LAYOUT_BREAKPOINT = 1024
const DEFAULT_OPEN = true

function SmartSidebar ({
  style,
  defaultOpen,
  disabled,
  fixedLayoutBreakpoint,
  path,
  $open,
  position,
  width,
  children,
  renderContent,
  ...props
}) {
  if (path) {
    console.warn('[@startupjs/ui] Sidebar: path is DEPRECATED, use $open instead.')
  }

  const componentId = useComponentId()

  if (!$open) {
    [, $open] = useLocal(path || `_session.SmartSidebar.${componentId}`)
  }

  let open
  let onChange
  ;({ open, onChange } = useBind({ $open: $open, open, onChange }))

  let [fixedLayout, $fixedLayout] = useValue(isFixedLayout(fixedLayoutBreakpoint))

  useLayoutEffect(() => {
    if (open && disabled) $open.setDiff(false)
  }, [!!open, !!disabled])

  useLayoutEffect(() => {
    if (disabled) return
    if (fixedLayout) {
      // when change dimensions from mobile
      // to desktop resolution or when rendering happen on desktop resolution
      // we open sidebar if it was opened on mobile resolution or default value
      $open.setDiff(open || defaultOpen)
    } else {
      // when change dimensions from desktop
      // to mobile resolution or when rendering heppen for mobile resolution
      // we always close sidebars
      $open.setDiff(false)
    }
  }, [!!fixedLayout])

  useLayoutEffect(() => {
    Dimensions.addEventListener('change', handleWidthChange)
    return () => Dimensions.removeEventListener('change', handleWidthChange)
  }, [])

  function handleWidthChange () {
    $fixedLayout.setDiff(isFixedLayout(fixedLayoutBreakpoint))
  }

  return pug`
    if fixedLayout
      Sidebar(
        style=style
        $open=$open
        position=position
        width=width
        renderContent=renderContent


      )= children
    else
      DrawerSidebar(
        style=style
        $open=$open
        position=position
        width=width
        renderContent=renderContent
        drawerLockMode=disabled ? 'locked-closed' : undefined
        ...props
      )= children
  `
}

SmartSidebar.defaultProps = {
  defaultOpen: false,
  disalbed: false,
  fixedLayoutBreakpoint: FIXED_LAYOUT_BREAKPOINT,
  position: 'left',
  width: 264
}

SmartSidebar.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  $open: PropTypes.object,
  defaultOpen: PropTypes.bool,
  disalbed: PropTypes.bool,
  fixedLayoutBreakpoint: PropTypes.number,
  position: PropTypes.oneOf(['left', 'right']),
  width: PropTypes.number,
  renderContent: PropTypes.func
}

export default observer(SmartSidebar)

function isFixedLayout (fixedLayoutBreakpoint) {
  let dim = Dimensions.get('window')
  return dim.width > fixedLayoutBreakpoint
}
