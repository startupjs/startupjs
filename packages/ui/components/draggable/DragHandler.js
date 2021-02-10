import React, { useEffect, useContext } from 'react'
import { Animated } from 'react-native'
import { State, PanGestureHandler } from 'react-native-gesture-handler'
import { useComponentId, observer } from 'startupjs'
import { DndContext } from './DndContext'
import './index.styl'

function DragWrapper ({
  children,
  style,
  type,
  onDragBegin,
  onDragEnd
}) {
  const componentId = useComponentId()
  const { monitor } = useContext(DndContext)

  const dragHandler = pug`
    DragHandler(
      type=type
      style=style
      onDragBegin=_onDragBegin
      onDragEnd=onDragEnd
    )=children
  `

  useEffect(() => {
    monitor.dragItems[componentId] = {
      source: dragHandler,
      bindId: ''
    }
    monitor.changeDragItems({ ...monitor.dragItems })
  }, [])

  function _onDragBegin (data, monitor) {
    monitor.changeActiveItemId(componentId)
    onDragBegin && onDragBegin(data, monitor)
  }

  if (!monitor.dragItems[componentId] || monitor.dragItems[componentId].bindId) {
    return null
  }

  return monitor.dragItems[componentId].source
}

function DragHandler ({
  children,
  style,
  type,
  onDragBegin,
  onDragEnd
}) {
  const { monitor } = useContext(DndContext)

  const translateX = new Animated.Value(0)
  const translateY = new Animated.Value(0)
  const lastOffset = { x: 0, y: 0 }

  const onGestureEvent = function ({ nativeEvent }) {
    translateX.setValue(nativeEvent.translationX)
    translateY.setValue(nativeEvent.translationY)

    monitor.changeActivePosition({
      x: nativeEvent.absoluteX,
      y: nativeEvent.absoluteY
    })
  }

  function resetStates () {
    lastOffset.x = 0
    lastOffset.y = 0
    translateX.setOffset(0)
    translateX.setValue(0)
    translateY.setOffset(0)
    translateY.setValue(0)
  }

  function onHandlerStateChange ({ nativeEvent }) {
    const data = {
      type,
      target: nativeEvent.target,
      x: nativeEvent.absoluteX,
      y: nativeEvent.absoluteY
    }

    if (nativeEvent.state === State.BEGAN) {
      monitor.changeActiveType(type)
      onDragBegin && onDragBegin(data, monitor)
    }

    if (nativeEvent.state === State.ACTIVE) {
      lastOffset.x += nativeEvent.translationX
      lastOffset.y += nativeEvent.translationY
      translateX.setOffset(lastOffset.x)
      translateY.setOffset(lastOffset.y)
      translateX.setValue(0)
      translateY.setValue(0)
    }

    if (nativeEvent.state === State.END) {
      resetStates()
      monitor.changeActiveType('')
      monitor.changeActivePosition({})
      onDragEnd && onDragEnd(data, monitor)
    }
  }

  return pug`
    PanGestureHandler(
      onGestureEvent=onGestureEvent
      onHandlerStateChange=onHandlerStateChange
    )
      Animated.View(
        style=[
          {
            width: 48,
            height: 48,
            backgroundColor: '#eee'
          },
          {
            transform: [
              { translateX },
              { translateY }
            ]
          }
        ]
      )= children
  `
}

export default observer(DragWrapper)
