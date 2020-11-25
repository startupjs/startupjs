// TODO:
// - Remove .getNode(), it's not longer needed on RN 0.62+ and gonna be removed.
//   (ref: https://reactnative.dev/blog/2020/03/26/version-0.62#deprecations)
//   This requires a breaking change asking people to upgrade their projects
//   to RN 0.62+

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import {
  View,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet,
  Platform
} from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Modal from '../../Modal'
import Arrow from './Arrow'
import Geometry from './Geometry'
import { PLACEMENTS_ORDER } from './constants.json'
import animate from './animate'
import STYLES from './index.styl'

const STEP_STATUSES = {
  CLOSE: 'close',
  RENDER: 'render',
  ANIMATE: 'animate',
  OPEN: 'open'
}

function isShtampInit (stepStatus) {
  return ['close', 'render'].indexOf(stepStatus) === -1
}

// TODO: autofix placement for ref
function Popover ({
  children,
  wrapperStyle,
  overlayStyle,
  backdropStyle,
  arrowStyle,
  visible,
  position,
  attachment,
  placements,
  animateType,
  durationOpen,
  durationClose,
  hasArrow,
  hasWidthCaption,
  onDismiss,
  onRequestOpen,
  onOverlayMouseMove
}) {
  wrapperStyle = StyleSheet.flatten([wrapperStyle])

  const refContent = useRef()
  const refContentOpen = useRef()
  const refGeometry = useRef()

  const [stepStatus, setStepStatus] = useState(STEP_STATUSES.CLOSE)
  const [validPlacement, setValidPlacement] = useState(position + '-' + attachment)
  const [localVisible, setLocalVisible] = useState(visible)
  const [contentInfo, setContentInfo] = useState({})
  const [captionSize, setCaptionSize] = useState({})

  const [animateStates] = useState({
    opacityOverlay: new Animated.Value(0),
    opacity: new Animated.Value(0),
    height: new Animated.Value(0),
    width: new Animated.Value(0),
    scaleX: new Animated.Value(1),
    scaleY: new Animated.Value(1),
    translateX: new Animated.Value(0),
    translateY: new Animated.Value(0)
  })

  // reset state after change dimensions
  useLayoutEffect(() => {
    const handleDimensions = () => {
      setContentInfo({})
      setStepStatus(STEP_STATUSES.CLOSE)
      onDismiss()
    }
    Dimensions.addEventListener('change', handleDimensions)
    return () => Dimensions.removeEventListener('change', handleDimensions)
  }, [])

  // -main
  useEffect(() => {
    if (stepStatus === STEP_STATUSES.CLOSE && visible) {
      setStepStatus(STEP_STATUSES.RENDER)
      setLocalVisible(true)
      setTimeout(runShow, 0)
    }

    if (stepStatus === STEP_STATUSES.OPEN && !visible) {
      if (!refContentOpen.current) return
      runHide()
    }
  }, [visible])
  // -

  function runShow () {
    refContent.current.measure((ex, ey, refWidth, refHeight, cx, cy) => {
      const { width, height, maxHeight } = wrapperStyle
      let curHeight = height || refHeight
      curHeight = (curHeight > maxHeight) ? maxHeight : curHeight

      let curWidth = width || refWidth
      curWidth = hasWidthCaption ? captionSize.width : curWidth
      const _contentInfo = {
        x: cx,
        y: cy,
        height: curHeight,
        width: curWidth
      }

      refGeometry.current = new Geometry({
        contentInfo: _contentInfo,
        placement: position + '-' + attachment,
        placements,
        captionSize,
        hasArrow
      })

      setValidPlacement(refGeometry.current.validPlacement)
      setContentInfo(_contentInfo)
      setStepStatus(STEP_STATUSES.ANIMATE)

      animate.show({
        durationOpen,
        geometry: refGeometry.current,
        contentInfo: _contentInfo,
        animateType,
        animateStates,
        hasArrow
      }, () => {
        setStepStatus(STEP_STATUSES.OPEN)
        onRequestOpen && onRequestOpen()
      })
    })
  }

  function runHide () {
    refContentOpen.current.getNode().measure((x, y, refWidth, refHeight) => {
      contentInfo.height = refHeight
      contentInfo.width = refWidth
      setStepStatus(STEP_STATUSES.ANIMATE)

      animate.hide({
        durationClose,
        geometry: refGeometry.current,
        animateType,
        contentInfo,
        animateStates,
        hasArrow
      }, () => {
        setLocalVisible(false)
        setStepStatus(STEP_STATUSES.CLOSE)
        onDismiss()
      })
    })
  }

  const _onOverlayMouseMove = () => {
    if (Platform.OS === 'web') {
      onOverlayMouseMove && onOverlayMouseMove()
    }
  }

  // parse children
  let caption = null
  let renderContent = []
  const onLayoutCaption = e => {
    setCaptionSize({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height
    })
  }
  React.Children.toArray(children).forEach((child, index, arr) => {
    if (child.type === PopoverCaption) {
      caption = child
      return
    }
    renderContent.push(child)
  })

  // styles
  const _backdropStyle = StyleSheet.flatten([
    backdropStyle,
    isShtampInit(stepStatus) ? {} : STYLES.shtamp
  ])

  const contentStyle = stepStatus === STEP_STATUSES.ANIMATE
    ? { height: animateStates.height }
    : Platform.OS === 'web'
      ? { height: '100%' }
      : { height: 'auto' }

  const _wrapperStyle = StyleSheet.flatten([
    wrapperStyle,
    isShtampInit(stepStatus) ? {
      position: 'absolute',
      opacity: animateStates.opacity,
      width: animateStates.width,
      transform: [
        { scaleX: animateStates.scaleX },
        { scaleY: animateStates.scaleY },
        { translateX: animateStates.translateX },
        { translateY: animateStates.translateY }
      ]
    } : STYLES.wrapper
  ])

  const _overlayStyle = StyleSheet.flatten([
    overlayStyle,
    { opacity: animateStates.opacityOverlay }
  ])

  const [validPosition] = validPlacement.split('-')
  if (isShtampInit(stepStatus) && validPosition === 'top') _wrapperStyle.bottom = 0
  if (isShtampInit(stepStatus) && validPosition === 'left') _wrapperStyle.right = 0
  if (isShtampInit(stepStatus) && validPlacement === 'left-end') _wrapperStyle.bottom = 0
  if (isShtampInit(stepStatus) && validPlacement === 'right-end') _wrapperStyle.bottom = 0

  if (stepStatus === STEP_STATUSES.ANIMATE) {
    _wrapperStyle.height = animateStates.height
  } else if (wrapperStyle.maxHeight) {
    _wrapperStyle.maxHeight = wrapperStyle.maxHeight
    _wrapperStyle.height = wrapperStyle.maxHeight
  }
  if (stepStatus === STEP_STATUSES.CLOSE) _wrapperStyle.height = 0
  if (hasWidthCaption && stepStatus !== STEP_STATUSES.ANIMATE) {
    _wrapperStyle.width = captionSize.width
  }

  const Wrapper = isShtampInit(stepStatus) ? Modal : View
  return pug`
    View
      if caption
        View(
          style=caption.props.style
          onLayout=onLayoutCaption
        )= caption.props.children
      if localVisible
        if isShtampInit(stepStatus)
          Wrapper(
            transparent=true
            visible=true
            ariaHideApp=false
            variant='pure'
            style=_backdropStyle
          )
            View.case
              TouchableWithoutFeedback(onPress=onDismiss)
                Animated.View.overlay(
                  style=_overlayStyle
                  onMouseMove=_onOverlayMouseMove
                )
              if caption
                View.absolute(style={
                  width: captionSize.width,
                  left: contentInfo.x,
                  top: contentInfo.y
                })= caption.props.children
              Animated.View.absolute(style={
                left: refGeometry.current.positionLeft,
                top: refGeometry.current.positionTop
              })
                Animated.View.popover(
                  ref=refContentOpen
                  pointerEvents='box-none'
                  style=_wrapperStyle
                  styleName={ wrapperArrow: hasArrow }
                )
                  if hasArrow
                    Arrow(
                      style=arrowStyle
                      geometry=refGeometry.current
                      validPosition=validPosition
                    )
                  Animated.View.content(style=contentStyle)
                    = renderContent
        else
          View.popover(
            ref=refContent
            style=_wrapperStyle
          )
            View.content
              = renderContent
  `
}

function PopoverCaption ({ children, style }) {
  return pug`
    View(style=style)
      = children
  `
}

Popover.defaultProps = {
  backdropStyle: { zIndex: 99999 },
  position: 'bottom',
  attachment: 'center',
  placements: PLACEMENTS_ORDER,
  animateType: 'default',
  hasWidthCaption: false,
  hasArrow: false,
  durationOpen: 300,
  durationClose: 300
}

Popover.propTypes = {
  wrapperStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  overlayStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  backdropStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  visible: PropTypes.bool.isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  attachment: PropTypes.oneOf(['start', 'center', 'end']),
  placements: PropTypes.arrayOf(PropTypes.oneOf(PLACEMENTS_ORDER)),
  animateType: PropTypes.oneOf(['default', 'slide', 'scale']),
  hasWidthCaption: PropTypes.bool,
  hasArrow: PropTypes.bool,
  durationOpen: PropTypes.number,
  durationClose: PropTypes.number,
  onDismiss: PropTypes.func,
  onRequestOpen: PropTypes.func
}

const ObservedPopover = observer(Popover)
ObservedPopover.Caption = PopoverCaption
export default ObservedPopover
