import React, { useMemo, useLayoutEffect } from 'react'
import { observer, useValue, useSession } from 'startupjs'
import { Dimensions } from 'react-native'
import PropTypes from 'prop-types'
import Sidebar from '../Sidebar'
import Drawer from '../Drawer'
import config from './config'

function SmartSidebar ({
  fixedLayoutBreakpoint,
  isOpen,
  position,
  width,
  backgroundColor,
  renderContent = () => null,
  children,
  onClose,
  onOpen,
  defaultOpen,
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
        isOpen=isOpen
        onClose=onClose
        onOpen=onOpen
        position=position
        width=width
        backgroundColor=backgroundColor
        renderContent=renderContent
      )= children
    else
      Drawer(
        isOpen=isOpen
        onClose=onClose
        onOpen=onOpen
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
  isOpen: PropTypes.bool,
  position: PropTypes.oneOf(['left', 'right']),
  width: PropTypes.number,
  renderContent: PropTypes.func.isRequired
}

SmartSidebar.defaultProps = {
  backgroundColor: config.backgroundColor,
  fixedLayoutBreakpoint: config.fixedLayoutBreakpoint,
  position: config.position,
  width: config.width
}

export default observer(SmartSidebar)

function isFixedLayout () {
  let dim = Dimensions.get('window')
  return dim.width > config.fixedLayoutBreakpoint
}
