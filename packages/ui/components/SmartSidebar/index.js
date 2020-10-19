import React, { useLayoutEffect } from 'react'
import {
  observer,
  useValue,
  useComponentId,
  useLocal,
  useBind
} from 'startupjs'
import PropTypes from 'prop-types'
import { Dimensions, StyleSheet } from 'react-native'
import Sidebar from '../Sidebar'
import DrawerSidebar from '../DrawerSidebar'
import STYLES from './index.styl'

const { colors } = STYLES

const FIXED_LAYOUT_BREAKPOINT = 1024

function SmartSidebar ({
  style,
  forceClosed,
  fixedLayoutBreakpoint,
  path,
  $open,
  position,
  width,
  backgroundColor,
  children,
  renderContent,
  defaultOpen,
  ...props
}) {
  if (path) {
    console.warn('[@startupjs/ui] Sidebar: path is DEPRECATED, use $open instead.')
  }

  if (/^#|rgb/.test(backgroundColor)) {
    console.warn('[@startupjs/ui] Sidebar:: Hex color for backgroundColor property is deprecated. Use style instead')
  }

  const componentId = useComponentId()
  if (!$open) {
    [, $open] = useLocal(path || `_session.SmartSidebar.${componentId}`)
  }

  ;({ backgroundColor = colors.white, ...style } = StyleSheet.flatten([
    { backgroundColor: colors[backgroundColor] || backgroundColor },
    style
  ]))

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
        backgroundColor=backgroundColor
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
        backgroundColor=backgroundColor
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
