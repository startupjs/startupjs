import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Animated,
  Modal as ModalNative,
  Platform,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native'
import ModalWeb from 'modal-react-native-web'
import { useRefCallback } from '../../../hooks'
import './index.styl'

const Modal = Platform.OS === 'web' ? ModalWeb : ModalNative

const SHTAMP_RENDER_STYLE = {
  overflow: 'hidden',
  height: 0,
  position: 'relative',
  left: 0,
  top: 0,
  width: 0
}

// TOD
// positionVertical: top
// improvement scale animate
const Popover = ({
  positionHorizontal,
  positionVertical,
  animateType,
  visible,
  hasWidthCaption,
  height,
  width,
  onDismiss,
  styleWrapper,
  children
}) => {
  const [coords, setCoords] = useState(null)
  const [contentHeight, setContentHeight] = useState(null)
  const [contentWidth, setContentWidth] = useState(null)
  const [captionSize, setCaptionSize] = useState({})

  const [isShow, setIsShow] = useState(true)
  const refCaption = useRef()
  const refContent = useRefCallback(node => {
    refContent.current = node
  }, !coords)

  const [opacity] = useState(new Animated.Value(visible ? 1 : 0))
  const [topAnimate] = useState(new Animated.Value(0))
  const [widthAnimate] = useState(new Animated.Value(
    (visible || animateType !== 'scale') ? (width || contentWidth) : 0
  ))
  const [heightAnimate] = useState(new Animated.Value(
    (visible || animateType === 'slide') ? (height || contentHeight) : 0
  ))

  useLayoutEffect(() => {
    const handleDimensions = () => {
      setCoords(null)
      opacity.setValue(0)
      if (animateType !== 'slide') heightAnimate.setValue(0)
      onDismiss()
    }
    Dimensions.addEventListener('change', handleDimensions)
    return () => Dimensions.removeEventListener('change', handleDimensions)
  }, [])

  useEffect(() => {
    if (visible) {
      setParams()
    } else {
      hide()
    }
  }, [visible])

  const setParams = () => {
    if (coords === null) {
      setTimeout(() => {
        setIsShow(true)
        refContent.current.getNode().measure((ex, ey, width, height, lx, ly) => {
          topAnimate.setValue(getTopPosition(ly, animateType === 'slide' ? 20 : 0))
          setCoords({ x: lx, y: ly })
          setContentHeight(height)
          setContentWidth(width)
          show(height)
        })
      }, 100)
    }
  }

  const show = contentHeight => {
    const animated = () => {
      Animated.parallel([
        animateType === 'slide' && Animated.timing(topAnimate, {
          toValue: topAnimate._value + 20, duration: 300
        }),
        animateType !== 'slide' && Animated.timing(heightAnimate, {
          toValue: height || contentHeight, duration: 300
        }),
        animateType === 'scale' && Animated.timing(widthAnimate, {
          toValue: width || contentWidth, duration: 300
        }),
        Animated.timing(opacity, { toValue: 1, duration: 300 })
      ]).start()
    }

    if (Platform.OS === 'android') {
      setTimeout(animated, 0)
    } else {
      animated()
    }
  }

  const hide = () => {
    Animated.parallel([
      animateType === 'slide' && Animated.timing(topAnimate, {
        toValue: topAnimate._value - 20, duration: 300
      }),
      animateType !== 'slide' && Animated.timing(heightAnimate, {
        toValue: 0, duration: 300
      }),
      animateType === 'scale' && Animated.timing(widthAnimate, {
        toValue: 0, duration: 300
      }),
      Animated.timing(opacity, { toValue: 0, duration: 400 })
    ]).start(() => {
      onDismiss()
      setIsShow(false)
      refCaption.current.measure((ex, ey, width, height) => {
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
    if (child.type === Popover.Caption) {
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
    top: topAnimate,
    height: heightAnimate,
    opacity: opacity,
    width: widthAnimate,
    ...styleWrapper
  }

  if (hasWidthCaption) {
    _styleWrapper.width = captionSize.width
  }

  if (!isShow) {
    _styleWrapper.height = 0
  }

  return pug`
    View
      if caption
        View(
          style=caption.props.style
          ref=refCaption
          onLayout=onLayoutCaption
        )
          = caption.props.children
      Wrapper(
        transparent=true
        visible=isShow
        ariaHideApp=false
        style=SHTAMP_RENDER_STYLE
      )
        View.case
          TouchableWithoutFeedback(onPress=onDismiss)
            Animated.View.overlay
          Animated.View.popover(
            pointerEvents='box-none'
            ref=refContent
            style=_styleWrapper
          )
            = renderContent
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
