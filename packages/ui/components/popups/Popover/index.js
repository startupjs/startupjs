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
import STYLES from './index.styl'

const POPOVER_MARGIN = 8
const ARROW_MARGIN = 10
const ARROW_SIZE = 8

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
// default if top, reverse

// placement: top-left = popoverPosition='top', arrowPosition='left'
// placement: top-center +
// placement: top-right +

// placement: bottom-left +
// placement: bottom-center +
// placement: bottom-right +

// placement: left-top -
// placement: left-center +
// placement: left-bottom -

// placement: right-top -
// placement: right-center +
// placement: right-bottom -

// positionHorizontal deprecated
// positionVertical deprecated
function Popover ({
  children,
  wrapperStyle,
  overlayStyle,
  backdropStyle,
  arrowStyle,
  visible,
  placement,
  positionHorizontal,
  positionVertical,
  animateType,
  hasWidthCaption,
  hasArrow,
  onDismiss,
  onRequestOpen
}) {
  const refCaption = useRef()
  const refContent = useRef()

  const [contentInfo, setContentInfo] = useState({})
  const [captionSize, setCaptionSize] = useState({})
  const [shtampStatus, setShtampStatus] = useState(SHTAMP_STATUSES.CLOSE)
  wrapperStyle = StyleSheet.flatten(wrapperStyle)

  // animate states
  const [animateOpacityOverlay] = useState(new Animated.Value(visible ? 1 : 0))
  const [animateOpacity] = useState(new Animated.Value(visible ? 1 : 0))
  const [animateTop] = useState(new Animated.Value(0))
  const [animateWidth] = useState(new Animated.Value(
    (visible || animateType !== 'scale') ? wrapperStyle.width : 0
  ))
  const [animateHeight] = useState(new Animated.Value(0))

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

      // set valid begin positon for animate
      animateTop.setValue(getTopPosition({
        cy,
        curHeight,
        offset: animateType === 'slide' ? 20 : 0
      }))
      setContentInfo({
        x: cx,
        y: cy,
        height: curHeight,
        width: width || refWidth
      })
      setShtampStatus(SHTAMP_STATUSES.ANIMATE)
      show(curHeight, width || refWidth)
    })
  }

  const show = (curHeight, curWidth) => {
    if (animateType === 'slide') animateHeight.setValue(curHeight)

    Animated.parallel([
      Animated.timing(animateOpacity, { toValue: 1, duration: 300 }),
      animateType === 'slide' && Animated.timing(animateTop, {
        toValue: animateTop._value + 20, duration: 300
      }),
      animateType !== 'slide' && Animated.timing(animateHeight, {
        toValue: curHeight, duration: 300
      }),
      animateType === 'scale' && Animated.timing(animateWidth, {
        toValue: curWidth, duration: 300
      }),
      Animated.timing(animateOpacityOverlay, { toValue: 0.5, duration: 300 })
    ]).start(() => {
      setShtampStatus(SHTAMP_STATUSES.OPEN)
      onRequestOpen && onRequestOpen()
    })
  }

  const runHide = () => {
    refContent.current.getNode().measure((x, y, refWidth, refHeight) => {
      setShtampStatus(SHTAMP_STATUSES.ANIMATE)
      animateHeight.setValue(refHeight)
      hide()
    })
  }

  const hide = () => {
    Animated.timing(animateOpacity, { toValue: 0, duration: 400 }).start()
    Animated.parallel([
      animateType === 'slide' && Animated.timing(animateTop, {
        toValue: animateTop._value - 20, duration: 300
      }),
      animateType !== 'slide' && Animated.timing(animateHeight, {
        toValue: 0, duration: 300
      }),
      animateType === 'scale' && Animated.timing(animateWidth, {
        toValue: 0, duration: 300
      }),
      Animated.timing(animateOpacityOverlay, { toValue: 0, duration: 400 })
    ]).start(() => {
      setShtampStatus(SHTAMP_STATUSES.CLOSE)
      onDismiss()
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

  // in helper
  const getLeftPosition = () => {
    if (!isShtampInit(shtampStatus)) return
    if (hasWidthCaption) return contentInfo.x
    if (positionVertical === 'center' && positionHorizontal === 'left') {
      const position = contentInfo.x - wrapperStyle.width
      return position - (hasArrow ? ARROW_SIZE + POPOVER_MARGIN : POPOVER_MARGIN)
    }
    if (positionVertical === 'center' && positionHorizontal === 'right') {
      const position = contentInfo.x + captionSize.width
      return position + (hasArrow ? ARROW_SIZE + POPOVER_MARGIN : POPOVER_MARGIN)
    }

    if (positionHorizontal === 'right') {
      return contentInfo.x
    }
    if (positionHorizontal === 'center') {
      return contentInfo.x - (wrapperStyle.width / 2) + (captionSize.width / 2)
    }
    if (positionHorizontal === 'left') {
      return contentInfo.x - wrapperStyle.width + captionSize.width
    }
  }

  // in helper
  const getLeftPositionArrow = () => {
    if (!isShtampInit(shtampStatus)) return
    if (positionVertical === 'center' && positionHorizontal === 'left') {
      return contentInfo.x - ARROW_SIZE - POPOVER_MARGIN
    }
    if (positionVertical === 'center' && positionHorizontal === 'right') {
      return contentInfo.x + captionSize.width
    }

    if (positionHorizontal === 'right') {
      return contentInfo.x + ARROW_MARGIN
    }
    if (positionHorizontal === 'left') {
      return (contentInfo.x + captionSize.width) - (ARROW_SIZE * 2) - ARROW_MARGIN
    }
    if (positionHorizontal === 'center') {
      return contentInfo.x + (captionSize.width / 2) - ARROW_SIZE
    }
  }

  // in helper
  const getTopPosition = ({ cy, offset = 0, curHeight }) => {
    if (positionVertical === 'center') {
      const position = (cy - offset) - (curHeight / 2) - (captionSize.height / 2)
      return position
    }

    if (positionVertical === 'bottom') {
      const position = cy - offset
      return position + (hasArrow ? ARROW_SIZE + POPOVER_MARGIN : POPOVER_MARGIN)
    }
    if (positionVertical === 'top') {
      const position = cy - curHeight - captionSize.height
      return position - (hasArrow ? ARROW_SIZE + POPOVER_MARGIN : POPOVER_MARGIN)
    }
  }

  // in helper
  const getTopPositionArrow = () => {
    const curTop = animateType === 'slide' ? animateTop._value + 20 : animateTop._value
    if (positionVertical === 'center') {
      return curTop + (contentInfo.height / 2) - ARROW_SIZE
    }

    if (positionVertical === 'top') return curTop + contentInfo.height
    return curTop - (ARROW_SIZE * 2)
  }

  const _backdropStyle = StyleSheet.flatten([
    backdropStyle,
    isShtampInit(shtampStatus) ? {} : STYLES.shtamp
  ])

  const _wrapperStyle = StyleSheet.flatten([
    wrapperStyle,
    isShtampInit(shtampStatus) ? {
      left: getLeftPosition(),
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
          if hasArrow && !(positionVertical === 'center' && positionHorizontal === 'center')
            Animated.View.arrow(
              style={
                left: getLeftPositionArrow(),
                top: getTopPositionArrow(),
                opacity: animateOpacity
              }
              styleName={
                arrowBottom: positionVertical === 'bottom',
                arrowTop: positionVertical === 'top',
                arrowCenterLeft: positionVertical === 'center' && positionHorizontal === 'left',
                arrowCenterRight: positionVertical === 'center' && positionHorizontal === 'right'
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
  positionHorizontal: 'right',
  positionVertical: 'bottom',
  animateType: 'default',
  hasWidthCaption: false,
  hasArrow: false
}

Popover.propTypes = {
  wrapperStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  overlayStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  backdropStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  visible: PropTypes.bool.isRequired,
  placement: PropTypes.oneOf(['left', 'center', 'right']),
  positionHorizontal: PropTypes.oneOf(['left', 'center', 'right']),
  positionVertical: PropTypes.oneOf(['bottom', 'center', 'top']),
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
