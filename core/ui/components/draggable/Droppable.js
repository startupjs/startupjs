import React, { useRef, useEffect, useContext } from 'react'
import { View, StatusBar } from 'react-native'
import { pug, observer, useValue } from 'startupjs'
import { DragDropContext } from './DragDropProvider'

export default observer(function Droppable ({
  children,
  style,
  type,
  dropId,
  onLeave,
  onHover
}) {
  const ref = useRef()
  const [dndContext, $dndContext] = useContext(DragDropContext)
  const [, $isHover] = useValue(false)

  useEffect(() => {
    $dndContext.set(`drops.${dropId}`, {
      ref,
      items: React.Children.map(children, child => {
        return child.props.dragId
      })
    })
  }, [children])

  useEffect(() => {
    ref.current.measure((x, y, width, height, pageX, pageY) => {
      if (!dndContext.activeData.dragId || !dndContext.dropHoverId) {
        $isHover.set(false)
        return
      }

      const leftBorder = pageX
      const rightBorder = pageX + width
      const topBorder = pageY
      const bottomBorder = pageY + height

      const isHoverUpdate = (
        dndContext.activeData.x > leftBorder &&
        dndContext.activeData.x < rightBorder &&
        dndContext.activeData.y - (StatusBar.currentHeight || 0) > topBorder &&
        dndContext.activeData.y - (StatusBar.currentHeight || 0) < bottomBorder
      )

      if (isHoverUpdate && !$isHover.get()) {
        $dndContext.set('dropHoverId', dropId)
        onHover && onHover() // TODO
      }

      if (!isHoverUpdate && $isHover.get()) {
        onLeave && onLeave() // TODO
      }

      $isHover.set(isHoverUpdate)
    })
  }, [JSON.stringify(dndContext.activeData)])

  const modChildren = React.Children.toArray(children).map((child, index) => {
    return React.cloneElement(child, {
      ...child.props,
      _dropId: dropId,
      _index: index
    })
  })

  const hasActiveDrag = dndContext.drops[dropId]?.items?.includes(dndContext.activeData.dragId)
  const activeStyle = hasActiveDrag ? { zIndex: 9999 } : {}
  const contextStyle = dndContext.drops[dropId]?.style || {}

  return pug`
    View(
      ref=ref
      style=[style, activeStyle, contextStyle]
    )= modChildren
  `
})
