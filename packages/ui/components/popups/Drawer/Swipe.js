import React, { useEffect, useMemo, useState } from 'react'
import { PanResponder, View, StyleSheet } from 'react-native'
import { pug, observer } from 'startupjs'
import themed from '../../../theming/themed'
import './index.styl'

const RESPONDER_STYLES = {
  left: { right: 0, width: '10%', height: '100%' },
  right: { left: 0, width: '10%', height: '100%' },
  bottom: { top: 0, width: '100%', height: '10%' },
  top: { bottom: 0, width: '100%', height: '10%' }
}

function Swipe ({
  position,
  contentSize,
  swipeStyle,
  isHorizontal,
  isSwipe,
  isInvertPosition,
  animateStates,
  runHide,
  runShow
}) {
  const [startDrag, setStartDrag] = useState(null)
  const [endDrag, setEndDrag] = useState(false)
  const [offset, setOffset] = useState(null)

  const dragZoneValue = useMemo(() => {
    // 15 percent
    return isHorizontal
      ? (contentSize.width / 100) * 15
      : (contentSize.height / 100) * 15
  }, [contentSize])

  useEffect(() => {
    if (offset === null) return
    if (endDrag === true) {
      const validOffset = isInvertPosition ? -offset : offset

      if (validOffset >= dragZoneValue) {
        runHide()
      } else {
        runShow()
      }

      setOffset(null)
      setStartDrag(null)
      setEndDrag(false)
      return
    }

    if (isInvertPosition && offset < 0) animateStates.position.setValue(offset)
    if (!isInvertPosition && offset > 0) animateStates.position.setValue(offset)
  }, [offset, endDrag])

  const responder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => false,
    onPanResponderTerminationRequest: () => false,
    onShouldBlockNativeResponder: () => false,
    onStartShouldSetResponderCapture: () => false,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => {
      return isHorizontal ? (gestureState.dx !== 0) : (gestureState.dy !== 0)
    },
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
      return isHorizontal ? (gestureState.dx !== 0) : (gestureState.dy !== 0)
    },
    onPanResponderGrant: e => {
      if (isHorizontal) {
        setStartDrag(e.nativeEvent.locationX)
      } else {
        setStartDrag(e.nativeEvent.locationY)
      }
    },
    onPanResponderMove: (e, gesture) => {
      if (startDrag) {
        setOffset(isHorizontal ? gesture.dx : gesture.dy)
      }
    },
    onPanResponderEnd: () => {
      if (startDrag) setEndDrag(true)
    }
  }), [startDrag, endDrag, contentSize])

  const _responder = !isSwipe ? { panHandlers: {} } : responder
  const _responderStyle = StyleSheet.flatten([
    RESPONDER_STYLES[position],
    swipeStyle
  ])

  return pug`
    View.responder(..._responder.panHandlers style=_responderStyle)
  `
}

export default observer(themed('Drawer', Swipe))
