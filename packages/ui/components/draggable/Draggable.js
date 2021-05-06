import React, { useContext, useEffect, useRef } from 'react'
import { Animated, View, StyleSheet } from 'react-native'
import { State, PanGestureHandler } from 'react-native-gesture-handler'
import { observer, $root } from 'startupjs'
import { Portal } from '@startupjs/ui'
import { DragDropContext } from './DragDropContext'
import './index.styl'

export default observer(function Draggable ({
  children,
  style,
  type,
  dragId,
  _dropId,
  _index,
  onDragBegin,
  onDragEnd
}) {
  const ref = useRef()
  const [dndContext, $dndContext] = useContext(DragDropContext)

  const animateStates = {
    left: new Animated.Value(0),
    top: new Animated.Value(0)
  }

  useEffect(() => {
    $dndContext.set(`drags.${dragId}`, {
      ref,
      style: {}
    })
  }, [
    _dropId,
    _index,
    dndContext.drags[dragId]?.ref?.current
  ])

  function onHandlerStateChange ({ nativeEvent }) {
    const data = {
      type,
      dragId,
      dropId: _dropId,
      drag: { style },
      start: {
        x: nativeEvent.x,
        y: nativeEvent.y
      }
    }

    if (nativeEvent.state === State.BEGAN) {
      ref.current.measure((dragX, dragY, dragWidth, dragHeight) => {
        data.drag.x = dragX
        data.drag.y = dragY
        data.drag.height = dragHeight

        dndContext.drops[_dropId].ref.current.measure((dx, dy, dw, dropHeight) => {
          animateStates.left.setValue(nativeEvent.absoluteX - data.start.x)
          animateStates.top.setValue(nativeEvent.absoluteY - data.start.y)

          $root.batch(() => {
            $dndContext.set(`drags.${dragId}.style`, { display: 'none' })
            $dndContext.set('activeData', data)
            $dndContext.set('dropHoverId', _dropId)
            $dndContext.set('dragHoverIndex', _index)
            onDragBegin && onDragBegin() // TODO
          })
        })
      })
    }

    if (nativeEvent.state === State.END) {
      animateStates.left.setValue(0)
      animateStates.top.setValue(0)

      onDragEnd && onDragEnd({
        dragId: dndContext.activeData.dragId,
        dropId: dndContext.activeData.dropId,
        dropHoverId: dndContext.dropHoverId,
        hoverIndex: dndContext.dragHoverIndex
      })

      $root.batch(() => {
        $dndContext.set('dropHoverId', '')
        $dndContext.set('dragHoverIndex', null)
        $dndContext.set('activeData', {})
        $dndContext.set(`drags.${dragId}.style`, {})
      })
    }
  }

  function onGestureEvent ({ nativeEvent }) {
    if (!dndContext.dropHoverId) return

    animateStates.left.setValue(
      nativeEvent.absoluteX - dndContext.activeData.start.x
    )
    animateStates.top.setValue(
      nativeEvent.absoluteY - dndContext.activeData.start.y
    )

    $dndContext.set('activeData.x', nativeEvent.absoluteX)
    $dndContext.set('activeData.y', nativeEvent.absoluteY)
    checkPosition(dndContext.activeData)
  }

  function checkPosition (activeData) {
    dndContext.drops[_dropId].ref.current.measure(async (dX, dY, dWidth, dHeight, dPageX, dPageY) => {
      const positions = []
      let startPosition = dPageY
      let endPosition = dPageY

      if (!dndContext.drops[dndContext.dropHoverId]) return

      for (let index = 0; index < dndContext.drops[dndContext.dropHoverId].items.length; index++) {
        const iterDragId = dndContext.drops[dndContext.dropHoverId].items[index]

        await new Promise(resolve => {
          dndContext.drags[iterDragId].ref.current.measure((x, y, width, height, pageX, pageY) => {
            if (index === 0) {
              startPosition = dPageY
              endPosition = dPageY + y + (height / 2)
            } else {
              startPosition = endPosition
              endPosition = pageY + (height / 2)
            }

            if (iterDragId === dragId) {
              positions.push(null)
            } else {
              positions.push({ start: startPosition, end: endPosition })
            }

            resolve()
          })
        })
      }

      positions.push({ start: endPosition, end: dPageY + dHeight })

      for (let index = 0; index < positions.length; index++) {
        const position = positions[index]
        if (!position) continue

        if (activeData.y > position.start && activeData.y < position.end) {
          $dndContext.set('dragHoverIndex', index)
          break
        }
      }
    })
  }

  const contextStyle = dndContext.drags[dragId]?.style || {}
  const _style = StyleSheet.flatten([
    style,
    animateStates
  ])

  const isShowPlaceholder = dndContext.activeData &&
    dndContext.dropHoverId === _dropId &&
    dndContext.dragHoverIndex === _index

  const isShowLastPlaceholder = dndContext.activeData &&
    dndContext.dropHoverId === _dropId &&
    dndContext.drops[_dropId].items.length - 1 === _index &&
    dndContext.dragHoverIndex === _index + 1

  return pug`
    if isShowPlaceholder
      View.placeholder(
        style={
          height: dndContext.activeData.drag.height,
          marginTop: dndContext.activeData.drag.style.marginTop,
          marginBottom: dndContext.activeData.drag.style.marginBottom
        }
      )

    Portal
      if dndContext.activeData.dragId === dragId
        Animated.View(style=[
          _style,
          { position: 'absolute', cursor: 'default' }
        ])= children

    PanGestureHandler(
      onHandlerStateChange=onHandlerStateChange
      onGestureEvent=onGestureEvent
    )
      Animated.View(
        ref=ref
        style=[style, contextStyle]
      )= children

    if isShowLastPlaceholder
      View.placeholder(
        style={
          height: dndContext.activeData.drag.height,
          marginTop: dndContext.activeData.drag.style.marginTop,
          marginBottom: dndContext.activeData.drag.style.marginBottom
        }
      )
  `
})
