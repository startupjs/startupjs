import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet
} from 'react-native'
import { observer } from 'startupjs'
import Modal from '../../Modal'
import geometry from './geometry'
import animate from './animate'
import STYLES from './index.styl'

const SHTAMP_STATUSES = {
  CLOSE: 'close',
  RENDER: 'render',
  ANIMATE: 'animate',
  OPEN: 'open'
}

function isShtampInit (shtampStatus) {
  return ['close', 'render'].indexOf(shtampStatus) === -1
}

// scale from transform style, with arrow

// placement: left-top -
// placement: left-bottom -
// placement: right-top -
// placement: right-bottom -

function Popover ({
  children,
  wrapperStyle,
  overlayStyle,
  backdropStyle,
  arrowStyle,
  visible,
  placement,
  animateType,
  hasWidthCaption,
  hasArrow,
  onDismiss,
  onRequestOpen
}) {
  wrapperStyle = StyleSheet.flatten([wrapperStyle])
  if (!wrapperStyle.width) wrapperStyle.width = 200

  const refCaption = useRef()
  const refContent = useRef()

  const [contentInfo, setContentInfo] = useState({})
  const [captionSize, setCaptionSize] = useState({})
  const [shtampStatus, setShtampStatus] = useState(SHTAMP_STATUSES.CLOSE)

  // animate states
  const [animateOpacityOverlay] = useState(new Animated.Value(visible ? 1 : 0))
  const [animateOpacity] = useState(new Animated.Value(visible ? 1 : 0))
  const [animateTop] = useState(new Animated.Value(0))
  const [animateLeft] = useState(new Animated.Value(0))
  const [animateWidth] = useState(new Animated.Value(
    (visible || animateType !== 'scale') ? wrapperStyle.width : 0
  ))
  const [animateHeight] = useState(new Animated.Value(0))
  const [animateScale] = useState(new Animated.Value(1))
  const [animateTranslateX] = useState(new Animated.Value(0))

  // reset state after change dimensions
  useLayoutEffect(() => {
    const handleDimensions = () => {
      setContentInfo({})
      setShtampStatus(SHTAMP_STATUSES.CLOSE)
      animateOpacity.setValue(0)
      if (animateType !== 'slide') animateHeight.setValue(0)
      onDismiss()
    }
    Dimensions.addEventListener('change', handleDimensions)
    return () => Dimensions.removeEventListener('change', handleDimensions)
  }, [])

  // -main
  useEffect(() => {
    if (!refContent.current || !refContent.current.getNode || !refContent.current.getNode()) {
      return
    }

    if (shtampStatus === SHTAMP_STATUSES.CLOSE && visible) {
      setShtampStatus(SHTAMP_STATUSES.RENDER)
      setTimeout(runShow, 0)
    }
    if (shtampStatus === SHTAMP_STATUSES.OPEN && !visible) runHide()
  }, [visible])

  useEffect(() => {
    if (shtampStatus === SHTAMP_STATUSES.ANIMATE && visible) {
      animateOpacity.setValue(1)
      setShtampStatus(SHTAMP_STATUSES.OPEN)
    }
  }, [children])
  // -

  const runShow = () => {
    refContent.current.getNode().measure((ex, ey, refWidth, refHeight, cx, cy) => {
      const { width, height, maxHeight } = wrapperStyle
      let curHeight = height || refHeight
      curHeight = (curHeight > maxHeight) ? maxHeight : curHeight

      const _contentInfo = {
        x: cx,
        y: cy,
        height: curHeight,
        width: width || refWidth
      }
      setContentInfo(_contentInfo)

      animateTop.setValue(geometry.getTopPosition({
        cy,
        placement,
        curHeight,
        captionSize,
        hasArrow,
        animateType
      }))

      animateLeft.setValue(geometry.getLeftPosition({
        placement,
        contentInfo: _contentInfo,
        captionSize,
        wrapperStyle,
        hasWidthCaption,
        hasArrow
      }))

      setShtampStatus(SHTAMP_STATUSES.ANIMATE)
      animate.show({
        cx,
        placement,
        curHeight,
        curWidth: width || refWidth,
        animateType,
        animateHeight,
        animateOpacity,
        animateTop,
        animateLeft,
        animateWidth,
        animateScale,
        animateTranslateX,
        animateOpacityOverlay
      }, () => {
        setShtampStatus(SHTAMP_STATUSES.OPEN)
        onRequestOpen && onRequestOpen()
      })
    })
  }

  const runHide = () => {
    refContent.current.getNode().measure((x, y, refWidth, refHeight) => {
      setShtampStatus(SHTAMP_STATUSES.ANIMATE)
      animateHeight.setValue(refHeight)

      animate.hide({
        placement,
        curHeight: refHeight,
        curWidth: refWidth,
        animateType,
        animateTop,
        animateOpacity,
        animateHeight,
        animateWidth,
        animateLeft,
        animateOpacityOverlay
      }, () => {
        setShtampStatus(SHTAMP_STATUSES.CLOSE)
        onDismiss()
      })
    })
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

  const _backdropStyle = StyleSheet.flatten([
    backdropStyle,
    isShtampInit(shtampStatus) ? {} : STYLES.shtamp
  ])

  const _wrapperStyle = StyleSheet.flatten([
    wrapperStyle,
    isShtampInit(shtampStatus) ? {
      left: animateLeft,
      top: animateTop,
      opacity: animateOpacity,
      width: animateWidth
    } : STYLES.wrapper
  ])

  const _overlayStyle = StyleSheet.flatten([
    overlayStyle,
    { opacity: animateOpacityOverlay }
  ])

  if (hasWidthCaption) _wrapperStyle.width = captionSize.width
  if (shtampStatus === SHTAMP_STATUSES.ANIMATE) _wrapperStyle.height = animateHeight
  else if (wrapperStyle.maxHeight) _wrapperStyle.maxHeight = wrapperStyle.maxHeight
  else if (!wrapperStyle.height) _wrapperStyle.height = 'auto'
  if (shtampStatus === SHTAMP_STATUSES.CLOSE) _wrapperStyle.height = 0

  console.log(_wrapperStyle)

  const [rootPlacement] = placement.split('-')
  const Wrapper = isShtampInit(shtampStatus) ? Modal : View
  return pug`
    View
      if caption
        if shtampStatus !== SHTAMP_STATUSES.OPEN
          View(
            ref=refCaption
            style=caption.props.style
            onLayout=onLayoutCaption
          )= caption.props.children
        else
          View(style=Object.assign({
            width: captionSize.width,
            height: captionSize.height
          }, caption.props.style))
      Wrapper(
        transparent=true
        visible=shtampStatus !== SHTAMP_STATUSES.CLOSE
        ariaHideApp=false
        variant='pure'
        style=_backdropStyle
      )
        View.case
          TouchableWithoutFeedback(onPress=onDismiss)
            Animated.View.overlay(style=_overlayStyle)
          if caption && contentInfo.x
            View(style={
              position: 'absolute',
              left: contentInfo.x,
              top: contentInfo.y - captionSize.height,
              width: captionSize.width
            })= caption.props.children
          Animated.View.scaleWrapper(style={
            transform: [{ scale: animateScale }, { translateX: animateTranslateX }]
          })
            if hasArrow
              Animated.View.arrow(
                style={
                  left: geometry.getLeftPositionArrow({
                    placement,
                    contentInfo,
                    captionSize,
                    isShtampInit,
                    shtampStatus
                  }),
                  top: geometry.getTopPositionArrow({
                    placement,
                    contentInfo,
                    animateType,
                    captionSize,
                    isShtampInit,
                    shtampStatus
                  }),
                  opacity: animateOpacity
                }
                styleName={
                  arrowBottom: rootPlacement === 'bottom',
                  arrowTop: rootPlacement === 'top',
                  arrowCenterLeft: placement === 'left-center',
                  arrowCenterRight: placement === 'right-center',
                }
              )
            Animated.View.popover(
              pointerEvents='box-none'
              ref=refContent
              style=_wrapperStyle
              styleName={ wrapperArrow: hasArrow }
            )= renderContent
  `
}

Popover.defaultProps = {
  wrapperStyle: { width: 200 },
  backdropStyle: { zIndex: 99999 },
  placement: 'bottom-left',
  animateType: 'default',
  hasWidthCaption: false,
  hasArrow: false
}

Popover.propTypes = {
  wrapperStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  overlayStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  backdropStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  visible: PropTypes.bool.isRequired,
  placement: PropTypes.oneOf(geometry.placementOrder),
  animateType: PropTypes.oneOf(['default', 'slide', 'scale']),
  hasWidthCaption: PropTypes.bool,
  hasArrow: PropTypes.bool,
  onDismiss: PropTypes.func,
  onRequestOpen: PropTypes.func
}

function PopoverCaption ({ children, style }) {
  return pug`
    View(style=style)
      = children
  `
}

const ObservedPopover = observer(Popover)
ObservedPopover.Caption = PopoverCaption
export default ObservedPopover
