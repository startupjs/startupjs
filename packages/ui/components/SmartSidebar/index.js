import React from 'react'
import { Dimensions } from 'react-native'
import {
  pug,
  observer,
  useValue,
  useComponentId,
  useLocal,
  useBind,
  useIsomorphicLayoutEffect
} from 'startupjs'
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
    // eslint-disable-next-line react-hooks/rules-of-hooks
    [, $open] = useLocal(path || `_session.SmartSidebar.${componentId}`)
  }

  let open
  let onChange
  ;({ open, onChange } = useBind({ $open, open, onChange })) // eslint-disable-line prefer-const

  const [fixedLayout, $fixedLayout] = useValue(isFixedLayout(fixedLayoutBreakpoint))

  useIsomorphicLayoutEffect(() => {
    if (!fixedLayout) return
    // or we can save open state before disabling
    // to open it with this state when enabling
    $open.setDiff(defaultOpen)
  }, [disabled])

  useIsomorphicLayoutEffect(() => {
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
  }, [fixedLayout])

  useIsomorphicLayoutEffect(() => {
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
    $fixedLayout.setDiff(isFixedLayout(fixedLayoutBreakpoint))
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
