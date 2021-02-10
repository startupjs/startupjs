import React, { useState } from 'react'

export const DndContext = React.createContext({})

export function DndProvider ({ children }) {
  const [dragItems, setDragItems] = useState({})
  const [dropItems, setDropItems] = useState({})
  const [activeType, setActiveType] = useState('')
  const [activePosition, setActivePosition] = useState({})
  const [activeItemId, setActiveItemId] = useState('')

  const monitor = {
    dragItems,
    dropItems,
    activeType,
    activePosition,
    activeItemId,

    changeDragItems: setDragItems,
    changeDropItems: setDropItems,
    changeActiveType: setActiveType,
    changeActivePosition: setActivePosition,
    changeActiveItemId: setActiveItemId
  }

  return pug`
    DndContext.Provider(value={ monitor })
      = children
  `
}
