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

function SmartSidebar ({
  style,
  forceClosed,
  fixedLayoutBreakpoint,
  path,
  $open,
  position,
  width,
  children,
  renderContent,
  defaultOpen,
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
        forceClosed=forceClosed
        renderContent=renderContent
        defaultOpen=defaultOpen
      )= children
    else
      DrawerSidebar(
        style=style
        $open=$open
        position=position
        width=width
        forceClosed=forceClosed
        renderContent=renderContent
        defaultOpen=defaultOpen
        ...props
      )= children
  `
}

SmartSidebar.defaultProps = {
  forceClosed: false,
  fixedLayoutBreakpoint: FIXED_LAYOUT_BREAKPOINT,
  position: 'left',
  width: 264
}

SmartSidebar.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  $open: PropTypes.object,
  forceClosed: PropTypes.bool,
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
