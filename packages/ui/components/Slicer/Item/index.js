import React, { useMemo } from 'react'
import { View } from 'react-native'

function Item ({
  index,
  children,
  sizeItem,
  itemsInfo,
  onChangeInfoItems
}) {
  const onLayout = e => {
    if (!sizeItem && !itemsInfo[index]) {
      itemsInfo[index] = ({
        position: e.nativeEvent.layout.y,
        size: e.nativeEvent.layout.height
      })
      onChangeInfoItems([...itemsInfo])
    }
  }

  return useMemo(() => {
    return pug`
      View(onLayout=onLayout)
        = children
    `
  })
}

export default Item
