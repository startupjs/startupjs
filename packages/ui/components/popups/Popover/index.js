import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Animated,
  Platform,
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet
} from 'react-native'
import Modal from '../../Modal'
import STYLES from './index.styl'

const { shadows } = STYLES

const SHTAMP_RENDER_STYLE = {
  overflow: 'hidden',
  position: 'relative',
  height: 0,
  left: 0,
  top: 0,
  width: 0
}

const MARGIN = 5
const ARROW_MARGIN = 16
const WITH_ARROW_MARGIN = 8
const ARROW_WIDTH = 10

const Popover = ({
  positionHorizontal,
  positionVertical,
  animateType,
  visible,
  hasWidthCaption,
  hasArrow,
  maxHeight,
  height,
  width,
  onDismiss,
  onRequestOpen,
  styleWrapper,
  styleOverlay,
  backdropStyle,
  children
}) => {
  const [coords, setCoords] = useState(null)
  const [contentSize, setContentSize] = useState({})
  const [captionSize, setCaptionSize] = useState({})

  const refCaption = useRef()
  const refContent = useRef()
  const [isRender, setIsRender] = useState(true)
  const [isAfterAnimate, setIsAfterAnimate] = useState(false)

  // animate states
  const [animateOpacityOverlay] = useState(new Animated.Value(visible ? 1 : 0))
  const [animateOpacity] = useState(new Animated.Value(visible ? 1 : 0))
  const [animateTop] = useState(new Animated.Value(0))
  const [animateWidth] = useState(new Animated.Value(
    (visible || animateType !== 'scale') ? width : 0
  ))
  const [animateHeight] = useState(new Animated.Value(0))

  // reset state with change dimensions
  useLayoutEffect(() => {
    const handleDimensions = () => {
      setCoords(null)
      animateOpacity.setValue(0)
      if (animateType !== 'slide') animateHeight.setValue(0)
      onDismiss()
    }
    Dimensions.addEventListener('change', handleDimensions)
    return () => Dimensions.removeEventListener('change', handleDimensions)
  }, [])

  // main
  useEffect(() => {
    animateOpacityOverlay.stopAnimation()
    animateOpacity.stopAnimation()
    animateTop.stopAnimation()
    animateWidth.stopAnimation()
    animateHeight.stopAnimation()

    if (visible) {
      // if animation hide closed ahead of time
      // and isRender and coords dont reset
      if (isRender || coords) {
        setIsRender(false)
        setIsAfterAnimate(false)
        setCoords(null)
      }
      showInit()
    } else {
      hideInit()
    }
  }, [visible])

  // if children change - stop animation
  // and use maxHeight
  useEffect(() => {
    // dont play animation if only popover open
    if (isRender && visible) setIsAfterAnimate(true)
  }, [children])

  const showInit = () => {
    if (!refContent.current || !refContent.current.getNode || !refContent.current.getNode()) {
      return
    }

    setIsRender(true)
    setTimeout(() => {
      refContent.current.getNode().measure((ex, ey, refWidth, refHeight, cx, cy) => {
        let curHeight = height || refHeight
        curHeight = (curHeight > maxHeight) ? maxHeight : curHeight

        // set correct positon
        animateTop.setValue(getTopPosition({
          cy,
          curHeight,
          offset: animateType === 'slide' ? 20 : 0
        }))
        setContentSize({
          height: curHeight,
          width: width || refWidth
        })
        setCoords({ x: cx, y: cy })
        show(curHeight, width || refWidth)
      })
    }, 100)
  }

  const show = (curHeight, curWidth) => {
    if (animateType === 'slide') animateHeight.setValue(curHeight)

    const animated = () => {
      Animated.timing(animateOpacity, { toValue: 1, duration: 300 }).start()
      Animated.parallel([
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
        setIsAfterAnimate(true)
        onRequestOpen && onRequestOpen()
      })
    }

    if (Platform.OS === 'android') {
      setTimeout(animated, 0)
    } else {
      animated()
    }
  }

  const hideInit = () => {
    if (!refContent.current || !refContent.current.getNode || !refContent.current.getNode()) {
      return
    }

    refContent.current.getNode().measure((ex, ey, refWidth, refHeight, cx, cy) => {
      animateHeight.setValue(refHeight)
      setIsAfterAnimate(false)
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
      onDismiss()
      setIsRender(false)
      setIsAfterAnimate(false)

      refCaption.current && refCaption.current.measure((ex, ey, width, height) => {
        setCaptionSize({ width, height })
        setCoords(null)
      })
    })
  }

  // parse children
  let caption = null
  let renderContent = []
  const onLayoutCaption = e => {
    setCaptionSize({
      x: e.nativeEvent.layout.x,
      y: e.nativeEvent.layout.y,
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height
    })
  }
  React.Children.toArray(children).forEach((child, index, arr) => {
    if (child.type.toString() === Popover.Caption.toString()) {
      caption = child
      return
    }
    renderContent.push(child)
  })

  const getLeftPosition = () => {
    if (!coords) return
    if (hasWidthCaption) return coords.x
    if (positionVertical === 'center' && positionHorizontal === 'left') {
      const position = coords.x - width
      return position - (hasArrow ? ARROW_WIDTH + MARGIN : MARGIN)
    }
    if (positionVertical === 'center' && positionHorizontal === 'right') {
      const position = coords.x + (captionSize ? captionSize.width : 0)
      return position + (hasArrow ? ARROW_WIDTH + MARGIN : MARGIN)
    }
    if (positionHorizontal === 'right') {
      return coords.x - (hasArrow ? WITH_ARROW_MARGIN : 0)
    }
    if (positionHorizontal === 'center') {
      return coords.x - (width / 2) + (captionSize ? (captionSize.width / 2) : 0)
    }
    if (positionHorizontal === 'left') {
      const position = coords.x - width + (captionSize ? captionSize.width : 0)
      return position + (hasArrow ? WITH_ARROW_MARGIN : 0)
    }
  }

  const getTopPosition = ({ cy, offset = 0, curHeight }) => {
    const _height = height || curHeight
    let position = null

    if (positionVertical === 'center') {
      position = (cy - offset) - (_height / 2) - (captionSize ? (captionSize.height / 2) : 0)
      return position
    }
    if (positionVertical === 'bottom') {
      position = cy - offset
      return position + (hasArrow ? ARROW_MARGIN : MARGIN)
    }
    if (positionVertical === 'top') {
      position = cy - _height - (captionSize && captionSize.height)
      return position - (hasArrow ? ARROW_MARGIN : MARGIN)
    }
  }

  const getLeftPositionArrow = () => {
    if (!coords) return
    if (positionVertical === 'center' && positionHorizontal === 'left') {
      return coords.x - ARROW_MARGIN
    }
    if (positionVertical === 'center' && positionHorizontal === 'right') {
      return coords.x + (captionSize ? captionSize.width : 0) - ARROW_WIDTH / 2
    }
    if (positionHorizontal === 'left') {
      return coords.x + (captionSize ? captionSize.width : 0) - (ARROW_WIDTH * 2) - 2
    }
    if (positionHorizontal === 'right') return coords.x + 2
    if (positionHorizontal === 'center') {
      let position = coords.x + (width / 2) - (captionSize ? (captionSize.height / 2) : 0)
      position -= ARROW_MARGIN / 2
      return position - ARROW_WIDTH
    }
  }

  const getTopPositionArrow = () => {
    const curTop = animateType === 'slide' ? animateTop._value + 20 : animateTop._value
    if (positionVertical === 'center') {
      return curTop + (contentSize.height / 2) - ARROW_WIDTH
    }
    if (positionVertical === 'top') {
      return curTop + contentSize.height
    }
    return curTop - 20
  }

  function getBackdropStyle () {
    return StyleSheet.flatten([
      backdropStyle,
      coords === null ? SHTAMP_RENDER_STYLE : {}
    ])
  }

  const Wrapper = coords === null ? View : Modal
  const _styleWrapper = coords === null ? {
    position: 'absolute',
    opacity: 0,
    left: 0,
    top: 0,
    width,
    ...styleWrapper
  } : {
    left: getLeftPosition(),
    top: animateTop,
    opacity: animateOpacity,
    width: animateWidth,
    ...shadows[3],
    ...styleWrapper
  }

  if (hasWidthCaption) _styleWrapper.width = captionSize.width
  if ((!isAfterAnimate && coords) || height) _styleWrapper.height = animateHeight
  else if (maxHeight) _styleWrapper.maxHeight = maxHeight
  else if (!height) _styleWrapper.height = 'auto'

  if (!isRender) _styleWrapper.height = 0
  const _styleOverlay = { ...styleOverlay, opacity: animateOpacityOverlay }

  return pug`
    View
      if caption
        if !isAfterAnimate
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
        visible=isRender
        ariaHideApp=false
        variant='pure'
        style=getBackdropStyle()
      )
        View.case
          TouchableWithoutFeedback(onPress=onDismiss)
            Animated.View.overlay(style=_styleOverlay)
          if caption && coords
            View(style={
              position: 'absolute',
              left: coords.x,
              top: coords.y - captionSize.height,
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
            style=_styleWrapper
          )= renderContent
  `
}

Popover.defaultProps = {
  positionHorizontal: 'right',
  positionVertical: 'bottom',
  animateType: 'default',
  hasWidthCaption: false,
  hasArrow: false,
  width: 200,
  backdropStyle: { zIndex: 99999 }
}

Popover.propTypes = {
  visible: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func,
  positionHorizontal: PropTypes.oneOf(['left', 'center', 'right']),
  positionVertical: PropTypes.oneOf(['bottom', 'center', 'top']),
  animateType: PropTypes.oneOf(['default', 'slide', 'scale']),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  hasWidthCaption: PropTypes.bool,
  styleBackdrop: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
}

Popover.Caption = ({ children, style }) => {
  return pug`
    View(style=style)
      = children
  `
}

export default Popover
