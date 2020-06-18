import React, { useLayoutEffect } from 'react'
import {
  observer,
  useValue,
  useComponentId,
  useLocal,
  useBind
} from 'startupjs'
import { Dimensions, StyleSheet } from 'react-native'
import propTypes from 'prop-types'
import Sidebar from '../Sidebar'
import DrawerSidebar from '../DrawerSidebar'
import config from '../../config/rootConfig'

const FIXED_LAYOUT_BREAKPOINT = 1024

function SmartSidebar ({
  style,
  forceClosed,
  fixedLayoutBreakpoint,
  path,
  $path,
  position,
  width,
  backgroundColor,
  children,
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
    [, $path] = useLocal(path || `_session.SmartSidebar.${componentId}`)
  }

  ;({ backgroundColor = config.colors.white, ...style } = StyleSheet.flatten([
    { backgroundColor: config.colors[backgroundColor] || backgroundColor },
    style
  ]))

  let isOpen
  let onChange
  ;({ isOpen, onChange } = useBind({ $path: $path, isOpen, onChange }))

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
        $path=$path
        position=position
        width=width
        forceClosed=forceClosed
        backgroundColor=backgroundColor
        renderContent=renderContent
      )= children
    else
      DrawerSidebar(
        style=style
        $path=$path
        position=position
        width=width
        forceClosed=forceClosed
        backgroundColor=backgroundColor
        renderContent=renderContent
        ...props
      )= children
  `
}

SmartSidebar.defaultProps = {
  forceClosed: false,
  backgroundColor: config.colors.white,
  fixedLayoutBreakpoint: FIXED_LAYOUT_BREAKPOINT,
  position: 'left',
  width: 264
}

SmartSidebar.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  $path: propTypes.object,
  forceClosed: propTypes.bool,
  backgroundColor: propTypes.string,
  fixedLayoutBreakpoint: propTypes.number,
  position: propTypes.oneOf(['left', 'right']),
  width: propTypes.number,
  renderContent: propTypes.func
}

export default observer(SmartSidebar)

function isFixedLayout (fixedLayoutBreakpoint) {
  let dim = Dimensions.get('window')
  return dim.width > fixedLayoutBreakpoint
}
