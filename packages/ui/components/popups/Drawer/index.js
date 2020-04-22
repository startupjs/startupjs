import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  SafeAreaView,
  Animated,
  Modal as ModalNative,
  View,
  TouchableWithoutFeedback,
  Platform,
  PanResponder,
  Dimensions
} from 'react-native'
import ModalWeb from 'modal-react-native-web'
import { useRefCallback } from '../../../hooks'
import './index.styl'

const Modal = Platform.OS === 'web' ? ModalWeb : ModalNative

const POSITION_STYLES = {
  left: { alignItems: 'flex-start' },
  right: { alignItems: 'flex-end' },
  top: { justifyContent: 'flex-start' },
  bottom: { justifyContent: 'flex-end' }
}

const POSITION_NAMES = {
  left: 'translateX',
  right: 'translateX',
  top: 'translateY',
  bottom: 'translateY'
}

const RESPONDER_STYLES = {
  left: { right: 0, width: '10%', height: '100%' },
  right: { left: 0, width: '10%', height: '100%' },
  bottom: { top: 0, width: '100%', height: '10%' },
  top: { bottom: 0, width: '100%', height: '10%' }
}

const SHTAMP_RENDER_STYLE = {
  left: -999,
  top: -999,
  position: 'absolute',
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height
}

// TODO: more test for work responder with ScrollView
// Fix performance native Modal. Replace with Portal ?
// https://material-ui.com/ru/components/drawers/#%D1%81%D1%82%D0%BE%D0%B9%D0%BA%D0%B0%D1%8F-%D0%BF%D0%B0%D0%BD%D0%B5%D0%BB%D1%8C
const Drawer = ({
  visible,
  position,
  onDismiss,
  isSwipe,
  isShowOverlay,
  hasDefaultStyleContent,
  styleSwipe,
  styleContent,
  styleCase,
  children
}) => {
  const isHorizontal = position === 'left' || position === 'right'
  const isInvertPosition = position === 'left' || position === 'top'

  const [contentHeight, setContentHeight] = useState(null)
  const [contentWidth, setContentWidth] = useState(null)

  const [isShow, setIsShow] = useState(true)
  const refContent = useRefCallback(node => {
    refContent.current = node
    setParams()
  }, true)

  const [opacity] = useState(new Animated.Value(visible ? 1 : 0))
  const [valuePosition] = useState(new Animated.Value(0))

  useEffect(() => {
    if (contentHeight === null && contentWidth === null) return
    if (visible) {
      show()
    } else {
      hide()
    }
  }, [visible])

  const setParams = () => {
    if (contentHeight !== null && contentWidth !== null) return
    setTimeout(() => {
      if (!refContent.current && !refContent.current.getNode()) return
      refContent.current.getNode().measure((x, y, width, height) => {
        setContentHeight(height)
        setContentWidth(width)
        if (!visible) {
          valuePosition.setValue(
            isHorizontal
              ? isInvertPosition ? -width : width
              : isInvertPosition ? -height : height
          )
        }
        setIsShow(visible)
      })
    }, 0)
  }

  const show = callback => {
    setIsShow(true)
    const animated = () => {
      Animated.parallel([
        Animated.timing(valuePosition, { toValue: 0, duration: 300 }),
        isShowOverlay && Animated.timing(opacity, { toValue: 1, duration: 300 })
      ]).start(() => {
        callback && callback()
      })
    }

    if (Platform.OS === 'android') {
      setTimeout(() => animated(), 0)
    } else {
      animated()
    }
  }

  const hide = callback => {
    Animated.parallel([
      Animated.timing(valuePosition, {
        toValue:
            isHorizontal
              ? isInvertPosition ? -contentWidth : contentWidth
              : isInvertPosition ? -contentHeight : contentHeight,
        duration: 200
      }),
      isShowOverlay && Animated.timing(opacity, { toValue: 0, duration: 200 })
    ]).start(() => {
      setIsShow(false)
      onDismiss()
      callback && callback()
    })
  }

  const [startDrag, setStartDrag] = useState(null)
  const [endDrag, setEndDrag] = useState(false)
  const [offset, setOffset] = useState(null)
  const dragZoneValue = useMemo(() => {
    // 15 percent
    return isHorizontal ? (contentWidth / 100) * 15 : (contentHeight / 100) * 15
  }, [contentHeight, contentWidth])
  useEffect(() => {
    if (offset === null) return
    if (endDrag === true) {
      const validOffset = isInvertPosition ? -offset : offset
      if (validOffset >= dragZoneValue) {
        hide()
      } else {
        show()
      }

      setOffset(null)
      setStartDrag(null)
      setEndDrag(false)
      return
    }

    if (isInvertPosition && offset < 0) valuePosition.setValue(offset)
    if (!isInvertPosition && offset > 0) valuePosition.setValue(offset)
  }, [offset, endDrag])
  const responder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => false,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => {
      return isHorizontal ? gestureState.dx !== 0 : gestureState.dy !== 0
    },
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
      return isHorizontal ? gestureState.dx !== 0 : gestureState.dy !== 0
    },
    onPanResponderTerminationRequest: () => false,
    onShouldBlockNativeResponder: () => false,
    onStartShouldSetResponderCapture: () => false,
    onPanResponderGrant: e => {
      if (position === 'left' || position === 'right') setStartDrag(e.nativeEvent.locationX)
      if (position === 'top' || position === 'bottom') setStartDrag(e.nativeEvent.locationY)
    },
    onPanResponderMove: (e, gesture) => {
      if (startDrag) {
        setOffset(isHorizontal ? gesture.dx : gesture.dy)
      }
    },
    onPanResponderEnd: () => {
      if (startDrag) setEndDrag(true)
    }
  }), [startDrag, endDrag, contentWidth, contentHeight])

  const Wrapper = (contentWidth || (!contentWidth && visible)) ? Modal : View
  const _styleCase = {
    ...POSITION_STYLES[position],
    ...styleCase,
    opacity: contentWidth ? 1 : 0
  }
  const _styleContent = {
    transform: [{ [POSITION_NAMES[position]]: valuePosition }],
    ...styleContent
  }
  const _responder = !isSwipe ? { panHandlers: {} } : responder
  const _responderStyle = { ...RESPONDER_STYLES[position], ...styleSwipe }

  return pug`
    Wrapper(
      transparent=true
      visible=isShow
      ariaHideApp=false
      style=SHTAMP_RENDER_STYLE
    )
      SafeAreaView.areaCase
        View.case(style=_styleCase)
          if isShowOverlay
            TouchableWithoutFeedback(onPress=onDismiss style={ cursor: 'default' })
              Animated.View.overlay(style={ opacity })
          Animated.View.s(
            ref=refContent
            styleName={
              content: hasDefaultStyleContent,
              contentBottom: hasDefaultStyleContent && position === 'bottom',
              fullHorizontal: hasDefaultStyleContent && isHorizontal,
              fullVertical: hasDefaultStyleContent && !isHorizontal
            }
            style=_styleContent
          )
            if isSwipe
              View.responder(..._responder.panHandlers style=_responderStyle)
            = children
  `
}

Drawer.defaultProps = {
  visible: false,
  position: 'left',
  isSwipe: true,
  isShowOverlay: true,
  hasDefaultStyleContent: true
}

Drawer.propTypes = {
  visible: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func,
  position: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
  isSwipe: PropTypes.bool,
  isShowOverlay: PropTypes.bool,
  hasDefaultStyleContent: PropTypes.bool,
  styleCase: PropTypes.object,
  styleContent: PropTypes.object
}

export default Drawer
