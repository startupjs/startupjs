import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Animated,
  Platform,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native'
import Modal from '../../Modal'
import './index.styl'

const SHTAMP_RENDER_STYLE = {
  overflow: 'hidden',
  height: 0,
  position: 'relative',
  left: 0,
  top: 0,
  width: 0
}

// TODO - positionVertical: top
const Popover = ({
  positionHorizontal,
  positionVertical,
  animateType,
  visible,
  hasWidthCaption,
  height,
  width,
  onDismiss,
  onRequestOpen,
  styleWrapper,
  styleOverlay,
  children
}) => {
  const [coords, setCoords] = useState(null)
  const [contentHeight, setContentHeight] = useState(null)
  const [contentWidth, setContentWidth] = useState(null)
  const [captionSize, setCaptionSize] = useState({})

  const refCaption = useRef()
  const refContent = useRef()
  const [isShow, setIsShow] = useState(true)

  const [animateOpacityOverlay] = useState(new Animated.Value(visible ? 1 : 0))
  const [animateOpacity] = useState(new Animated.Value(visible ? 1 : 0))
  const [animateTop] = useState(new Animated.Value(0))
  const [animateWidth] = useState(new Animated.Value(
    (visible || animateType !== 'scale') ? (width || contentWidth) : 0
  ))
  const [heightAnimate] = useState(new Animated.Value(
    (visible || animateType === 'slide') ? (height || contentHeight) : 0
  ))

  useLayoutEffect(() => {
    const handleDimensions = () => {
      setCoords(null)
      animateOpacity.setValue(0)
      if (animateType !== 'slide') heightAnimate.setValue(0)
      onDismiss()
    }
    Dimensions.addEventListener('change', handleDimensions)
    return () => Dimensions.removeEventListener('change', handleDimensions)
  }, [])

  useEffect(() => {
    animateOpacityOverlay.stopAnimation()
    animateOpacity.stopAnimation()
    animateTop.stopAnimation()
    animateWidth.stopAnimation()
    heightAnimate.stopAnimation()

    if (visible) setParams()
    else hide()
  }, [visible])

  const setParams = () => {
    if (!refContent.current || !refContent.current.getNode || !refContent.current.getNode()) {
      return
    }

    setTimeout(() => {
      setIsShow(true)
      refContent.current.getNode().measure((ex, ey, width, height, lx, ly) => {
        animateTop.setValue(getTopPosition(ly, animateType === 'slide' ? 20 : 0))
        setCoords({ x: lx, y: ly })
        setContentHeight(height)
        setContentWidth(width)
        show(height)
      })
    }, 100)
  }

  const show = contentHeight => {
    const animated = () => {
      Animated.parallel([
        animateType === 'slide' && Animated.timing(animateTop, {
          toValue: animateTop._value + 20, duration: 300
        }),
        animateType !== 'slide' && Animated.timing(heightAnimate, {
          toValue: height || contentHeight, duration: 300
        }),
        animateType === 'scale' && Animated.timing(animateWidth, {
          toValue: width || contentWidth, duration: 300
        }),
        Animated.timing(animateOpacityOverlay, { toValue: 0.5, duration: 300 }),
        Animated.timing(animateOpacity, { toValue: 1, duration: 300 })
      ]).start(() => {
        onRequestOpen()
      })
    }

    if (Platform.OS === 'android') {
      setTimeout(animated, 0)
    } else {
      animated()
    }
  }

  const hide = () => {
    Animated.parallel([
      animateType === 'slide' && Animated.timing(animateTop, {
        toValue: animateTop._value - 20, duration: 300
      }),
      animateType !== 'slide' && Animated.timing(heightAnimate, {
        toValue: 0, duration: 300
      }),
      animateType === 'scale' && Animated.timing(animateWidth, {
        toValue: 0, duration: 300
      }),
      Animated.timing(animateOpacityOverlay, { toValue: 0, duration: 400 }),
      Animated.timing(animateOpacity, { toValue: 0, duration: 400 })
    ]).start(() => {
      onDismiss()
      setIsShow(false)

      refCaption.current && refCaption.current.measure((ex, ey, width, height) => {
        setCaptionSize({ width, height })
        setCoords(null)
      })
    })
  }

  let caption = null
  let renderContent = []
  const onLayoutCaption = e => {
    setCaptionSize({
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
      return coords.x - width
    }
    if (positionVertical === 'center' && positionHorizontal === 'right') {
      return coords.x + (captionSize ? captionSize.width : 0)
    }
    if (positionHorizontal === 'right') {
      return coords.x
    }
    if (positionHorizontal === 'center') {
      return coords.x - (width / 2) + (captionSize ? (captionSize.width / 2) : 0)
    }
    if (positionHorizontal === 'left') {
      return coords.x - width + (captionSize ? captionSize.width : 0)
    }
  }

  const getTopPosition = (cy, offset = 0) => {
    if (positionVertical === 'center') {
      return (cy - offset) - (height / 2) - (captionSize ? (captionSize.height / 2) : 0)
    }
    if (positionVertical === 'bottom') {
      return cy - offset
    }
  }

  const Wrapper = coords === null ? View : Modal
  const _styleWrapper = coords === null ? {
    position: 'absolute',
    opacity: 0,
    left: 0,
    top: 0,
    ...styleWrapper
  } : {
    left: getLeftPosition(),
    top: animateTop,
    height: heightAnimate,
    opacity: animateOpacity,
    width: animateWidth,
    ...styleWrapper
  }

  if (hasWidthCaption) _styleWrapper.width = captionSize.width
  if (!isShow) _styleWrapper.height = 0
  const _styleOverlay = { ...styleOverlay, opacity: animateOpacityOverlay }

  return pug`
    View
      if caption
        View(
          style=caption.props.style
          ref=refCaption
          onLayout=onLayoutCaption
        )= caption.props.children
      Wrapper(
        transparent=true
        visible=isShow
        ariaHideApp=false
        variant='pure'
        style=coords === null ? SHTAMP_RENDER_STYLE : {}
      )
        View.case
          TouchableWithoutFeedback(onPress=onDismiss)
            Animated.View.overlay(style=_styleOverlay)
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
  hasWidthCaption: true
}

Popover.propTypes = {
  visible: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func,
  positionHorizontal: PropTypes.oneOf(['left', 'center', 'right']),
  positionVertical: PropTypes.oneOf(['bottom', 'center', 'top']),
  animateType: PropTypes.oneOf(['default', 'slide', 'scale']),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  hasWidthCaption: PropTypes.bool
}

Popover.Caption = ({ children, style }) => {
  return pug`
    View(style=style)
      = children
  `
}

export default Popover
