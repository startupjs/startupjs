import React, { useMemo, useLayoutEffect } from 'react'
import { observer, useValue, useSession } from 'startupjs'
import { Dimensions } from 'react-native'
import PropTypes from 'prop-types'
import Sidebar from '../Sidebar'
import Drawer from '../Drawer'
import config from '../../config/rootConfig'

const FIXED_LAYOUT_BREAKPOINT = 1024

function SmartSidebar ({
  fixedLayoutBreakpoint,
  open,
  position,
  width,
  backgroundColor,
  children,
  renderContent = () => null,
  ...props
}) {
  const [, $isFixedLayout] = useSession('isFixedLayout')

  let initialFixedLayout = useMemo(isFixedLayout, [])
  let [fixedLayout, $fixedLayout] = useValue(initialFixedLayout)

  useLayoutEffect(() => {
    const isFixedLayout = !!fixedLayout

    $isFixedLayout.setDiff(isFixedLayout)
  }, [!!fixedLayout])

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
        open=open
        position=position
        width=width
        backgroundColor=backgroundColor
        renderContent=renderContent
      )= children
    else
      Drawer(
        open=open
        position=position
        width=width
        backgroundColor=backgroundColor
        renderContent=renderContent
      )= children
  `
}

SmartSidebar.propTypes = {
  backgroundColor: PropTypes.string,
  fixedLayoutBreakpoint: PropTypes.number,
  open: PropTypes.bool,
  position: PropTypes.oneOf(['left', 'right']),
  width: PropTypes.number,
  renderContent: PropTypes.func.isRequired
}

SmartSidebar.defaultProps = {
  backgroundColor: config.colors.white,
  fixedLayoutBreakpoint: FIXED_LAYOUT_BREAKPOINT,
  position: 'left',
  width: 264
}

export default observer(SmartSidebar)

function isFixedLayout () {
  let dim = Dimensions.get('window')
  return dim.width > FIXED_LAYOUT_BREAKPOINT
}
