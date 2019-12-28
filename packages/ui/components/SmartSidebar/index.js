import React, { useRef, useMemo, useLayoutEffect } from 'react'
import { observer, useOn, useLocal, useValue, useSession } from 'startupjs'
import { Dimensions } from 'react-native'
import PropTypes from 'prop-types'
import Sidebar from '../Sidebar'
import Drawer from '../Drawer'
import config from './config'

function SmartSidebar ({
  fixedLayoutBreakpoint,
  nsPath,
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
  let drawerRef = useRef()

  const [, $isFixedLayout] = useSession('isFixedLayout')

  let initialFixedLayout = useMemo(isFixedLayout, [])
  let [fixedLayout, $fixedLayout] = useValue(initialFixedLayout)

  const [isOpen, $isOpen] = useLocal(ns(nsPath, 'isOpen'))

  const _defaultOpen = useMemo(() => {
    return defaultOpen === undefined ? true : defaultOpen
  }, [])

  useLayoutEffect(() => {
    const isFixedLayout = !!fixedLayout
    if (isFixedLayout) {
      // when change dimensions from mobile
      // to desktop resolution or when rendering happen on desktop resolution
      // we open sidebar if it was opened on mobile resolution or default value
      $isOpen.setDiff(isOpen || _defaultOpen)
    } else {
      // when change dimensions from desktop
      // to mobile resolution or when rendering heppen for mobile resolution
      // we always close sidebars
      $isOpen.setDiff(isFixedLayout)
    }
    $isFixedLayout.setDiff(isFixedLayout)
  }, [!!fixedLayout])

  useLayoutEffect(() => {
    Dimensions.addEventListener('change', handleWidthChange)
    return () => Dimensions.removeEventListener('change', handleWidthChange)
  }, [])

  useOn('change', $isOpen, (value, prevValue) => {
    let drawer = drawerRef.current
    if (!drawer) return
    if (!!value === !!prevValue) return
    if (value) {
      drawer.openDrawer()
    } else {
      drawer.closeDrawer()
    }
  })

  function handleWidthChange () {
    $fixedLayout.setDiff(isFixedLayout())
  }

  return pug`
    if fixedLayout
      Sidebar(
        nsPath=nsPath
        position=position
        width=width
        backgroundColor=backgroundColor
        renderContent=renderContent
      )= children
    else
      Drawer= children
  `
}

SmartSidebar.propTypes = {
  backgroundColor: PropTypes.string,
  defaultOpen: PropTypes.bool,
  fixedLayoutBreakpoint: PropTypes.number,
  nsPath: PropTypes.string,
  position: PropTypes.oneOf(['left', 'right']),
  width: PropTypes.number,
  renderContent: PropTypes.func.isRequired
}

SmartSidebar.defaultProps = {
  backgroundColor: config.backgroundColor,
  defaultOpen: config.defaultOpen,
  fixedLayoutBreakpoint: config.fixedLayoutBreakpoint,
  nsPath: config.nsPath,
  position: config.position,
  width: config.width
}

export default observer(SmartSidebar)

function ns (path, subpath) {
  if (subpath) return path + '.' + subpath
  return path
}

function isFixedLayout () {
  let dim = Dimensions.get('window')
  return dim.width > config.fixedLayoutBreakpoint
}
