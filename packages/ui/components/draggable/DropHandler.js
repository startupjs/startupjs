import React, {
  useContext,
  useState,
  useEffect,
  useRef
} from 'react'
import { View } from 'react-native'
import { useComponentId, observer } from 'startupjs'
import { DndContext } from './DndContext'

function DrogHandler ({
  type,
  style = {},
  activeStyle = {},
  hoverStyle = {},
  onDrop,
  onHover
}, ref) {
  const componentId = useComponentId()
  const { monitor } = useContext(DndContext)
  const [isHover, setIsHover] = useState(false)
  const refDrop = useRef()

  useEffect(() => {
    if (isHover && !monitor.activePosition.x && !monitor.activePosition.y) {
      monitor.dropItems[componentId] = monitor.dragItems[monitor.activeItemId].source

      if (monitor.dragItems[monitor.activeItemId].bindId !== componentId) {
        const activeDrag = monitor.dragItems[monitor.activeItemId]
        monitor.dropItems[activeDrag.bindId] = null
      }
      monitor.dragItems[monitor.activeItemId].bindId = componentId

      monitor.changeDropItems({ ...monitor.dropItems })
      monitor.changeDragItems({ ...monitor.dragItems })
    }

    refDrop.current.measure((x, y, width, height, pageX, pageY) => {
      const leftBorder = pageX
      const rightBorder = pageX + width
      const topBorder = pageY
      const bottomBorder = pageY + height

      const isHoverUpdate = (
        monitor.activePosition.x > leftBorder &&
        monitor.activePosition.x < rightBorder &&
        monitor.activePosition.y > topBorder &&
        monitor.activePosition.y < bottomBorder
      )

      if (isHoverUpdate && !isHover) {
        onHover && onHover(ref, monitor)
      }
      setIsHover(isHoverUpdate)
    })
  }, [monitor.activePosition])

  return pug`
    View(
      ref=refDrop
      style=[
        style,
        type === monitor.activeType && activeStyle,
        isHover && hoverStyle
      ]
    )= monitor.dropItems[componentId] || null
  `
}

export default observer(DrogHandler)
