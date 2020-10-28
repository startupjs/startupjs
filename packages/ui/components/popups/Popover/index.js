import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet,
  Platform
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

// TODO docs
// geometry to ref.current
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
  const [localPlacement, setLocalPlacement] = useState(placement)

  // animate states
  const [animateOpacityOverlay] = useState(new Animated.Value(visible ? 1 : 0))
  const [animateOpacity] = useState(new Animated.Value(visible ? 1 : 0))
  const [animateTop] = useState(new Animated.Value(0))
  const [animateLeft] = useState(new Animated.Value(0))
  const [animateWidth] = useState(new Animated.Value(
    (visible || animateType !== 'scale') ? wrapperStyle.width : 0
  ))
  const [animateHeight] = useState(new Animated.Value(0))
  const [animateScaleX] = useState(new Animated.Value(1))
  const [animateScaleY] = useState(new Animated.Value(1))
  const [animateTranslateX] = useState(new Animated.Value(0))
  const [animateTranslateY] = useState(new Animated.Value(0))

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

  // TODO: children resize
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

      let curWidth = width || refWidth
      curWidth = hasWidthCaption ? captionSize.width : curWidth
      const _contentInfo = {
        x: cx,
        y: cy,
        height: curHeight,
        width: width || refWidth
      }

      const { positionTop, positionLeft, validPlacement } = geometry.getPositions({
        placement: localPlacement,
        cy,
        curHeight,
        curWidth,
        captionSize,
        hasArrow,
        hasWidthCaption,
        animateType,
        contentInfo: _contentInfo
      })

      animateTop.setValue(positionTop)
      animateLeft.setValue(positionLeft)

      setLocalPlacement(validPlacement)
      setContentInfo(_contentInfo)
      setShtampStatus(SHTAMP_STATUSES.ANIMATE)

      animate.show({
        placement: validPlacement,
        cx,
        curHeight,
        curWidth,
        animateType,
        animateHeight,
        animateOpacity,
        animateTop,
        animateLeft,
        animateWidth,
        animateScaleX,
        animateScaleY,
        animateTranslateX,
        animateTranslateY,
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
        placement: localPlacement,
        curHeight: refHeight,
        curWidth: refWidth,
        animateType,
        animateTop,
        animateOpacity,
        animateHeight,
        animateLeft,
        animateWidth,
        animateScaleX,
        animateScaleY,
        animateTranslateX,
        animateTranslateY,
        animateOpacityOverlay
      }, () => {
        setShtampStatus(SHTAMP_STATUSES.CLOSE)
        setLocalPlacement(placement)
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

  // styles
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
      width: animateWidth,
      transform: [
        { scaleX: animateScaleX },
        { scaleY: animateScaleY },
        { translateX: animateTranslateX },
        { translateY: animateTranslateY }
      ]
    } : STYLES.wrapper
  ])

  const _overlayStyle = StyleSheet.flatten([
    overlayStyle,
    { opacity: animateOpacityOverlay }
  ])

  const _arrowStyle = StyleSheet.flatten([
    arrowStyle,
    {
      left: geometry.arrowLeftPositions[localPlacement],
      top: geometry.arrowTopPositions[localPlacement]
    }
  ])

  const contentStyle = shtampStatus === SHTAMP_STATUSES.ANIMATE
    ? { height: animateHeight }
    : Platform.OS === 'web'
      ? { height: '100%' }
      : { height: 'auto' }

  if (hasWidthCaption && shtampStatus !== SHTAMP_STATUSES.ANIMATE) {
    _wrapperStyle.width = captionSize.width
  }
  if (shtampStatus === SHTAMP_STATUSES.ANIMATE) _wrapperStyle.height = animateHeight
  else if (wrapperStyle.maxHeight) _wrapperStyle.maxHeight = wrapperStyle.maxHeight
  else if (!wrapperStyle.height) _wrapperStyle.height = 'auto'
  if (shtampStatus === SHTAMP_STATUSES.CLOSE) _wrapperStyle.height = 0

  const [rootPlacement] = localPlacement.split('-')
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
          Animated.View.popover(
            pointerEvents='box-none'
            ref=refContent
            style=_wrapperStyle
            styleName={ wrapperArrow: hasArrow }
          )
            if hasArrow
              Animated.View.arrow(
                style=_arrowStyle
                styleName={
                  arrowBottom: rootPlacement === 'bottom',
                  arrowTop: rootPlacement === 'top',
                  arrowLeft: rootPlacement === 'left',
                  arrowRight: rootPlacement === 'right',
                }
              )
            Animated.View.content(style=contentStyle)
              = renderContent
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
