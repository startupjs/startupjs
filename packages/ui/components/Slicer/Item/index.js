import React from 'react'
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
        position: parseInt(e.nativeEvent.layout.y),
        size: parseInt(e.nativeEvent.layout.height)
      })
      onChangeInfoItems([...itemsInfo])
    }
  }

  return pug`
    View(onLayout=onLayout)
      = children
  `
}

export default Item
