import React, { useLayoutEffect } from 'react'
import { observer, useValue, useComponentId } from 'startupjs'
import { Dimensions } from 'react-native'
import propTypes from 'prop-types'
import Sidebar from '../Sidebar'
import Drawer from '../Drawer'
import config from '../../config/rootConfig'

const FIXED_LAYOUT_BREAKPOINT = 1024

function SmartSidebar ({
  style,
  fixedLayoutBreakpoint,
  path,
  position,
  width,
  backgroundColor,
  children,
  renderContent = () => null,
  ...props
}) {
  const componentId = useComponentId()
  if (!path) path = `_session.SmartSidebar.${componentId}`

  let [fixedLayout, $fixedLayout] = useValue(isFixedLayout())

  useLayoutEffect(() => {
    Dimensions.addEventListener('change', handleWidthChange)
    return () => Dimensions.removeEventListener('change', handleWidthChange)
  }, [])

  function handleWidthChange () {
    $fixedLayout.setDiff(isFixedLayout())
  }

  return pug`
    if fixedLayout
      Sidebar(
        style=style
        path=path
        position=position
        width=width
        backgroundColor=backgroundColor
        renderContent=renderContent
      )= children
    else
      Drawer(
        style=style
        path=path
        position=position
        width=width
        backgroundColor=backgroundColor
        renderContent=renderContent
        ...props
      )= children
  `
}

SmartSidebar.defaultProps = {
  backgroundColor: config.colors.white,
  fixedLayoutBreakpoint: FIXED_LAYOUT_BREAKPOINT,
  position: 'left',
  width: 264
}

SmartSidebar.propTypes = {
  style: propTypes.object,
  children: propTypes.node,
  backgroundColor: propTypes.string,
  fixedLayoutBreakpoint: propTypes.number,
  position: propTypes.oneOf(['left', 'right']),
  width: propTypes.number,
  renderContent: propTypes.func.isRequired
}

export default observer(SmartSidebar)

function isFixedLayout () {
  let dim = Dimensions.get('window')
  return dim.width > FIXED_LAYOUT_BREAKPOINT
}
