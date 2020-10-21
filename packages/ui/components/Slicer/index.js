import React, { useRef, useState } from 'react'
import { View, ScrollView } from 'react-native'
import { observer } from 'startupjs'
import Item from './Item'

// TODO: mode = horizontal
function Slicer ({
  style,
  children,
  sizeItem,
  onScroll,
  onScrollEnd,
  onLayout,
  countVisibleElements,
  countNearElements
}) {
  const ref = useRef()
  const positionItemIndex = useRef(0)
  const scrollEndTimer = useRef(null)
  const [scrollHeight, setScrollHeight] = useState(null)
  const [itemsInfo, setItemsInfo] = useState([])
  const [styleView, setStyleView] = useState({})

  function getSliceInfo () {
    if (positionItemIndex.current <= countNearElements) {
      // 0..20 | 80 | 20
      return {
        start: 0,
        end: positionItemIndex.current + countVisibleElements + countNearElements
      }
    } else {
      // padding | 20 | 80 | 20
      return {
        start: positionItemIndex.current - countNearElements,
        end: positionItemIndex.current + countNearElements + countVisibleElements
      }
    }
  }

  function _onScroll (e) {
    const scrollPosition = e.nativeEvent.contentOffset.y
    positionItemIndex.current = sizeItem
      ? mathSeacrh(scrollPosition)
      : binarySeacrh({
        start: 0,
        end: itemsInfo.length - 1,
        scrollPosition
      })

    const sliceInfo = getSliceInfo()
    let paddingTop = 0
    let paddingBottom = 0
    for (let i = 0; i < sliceInfo.start; i++) {
      if (itemsInfo[i]) paddingTop += itemsInfo[i].size
    }
    for (let i = sliceInfo.end; i < itemsInfo.length; i++) {
      if (itemsInfo[i]) paddingBottom += itemsInfo[i].size
    }

    setStyleView({ paddingTop, paddingBottom })
    onScroll && onScroll(e)

    const curPosition = e.nativeEvent.contentOffset.y + scrollHeight + 200
    if (!scrollEndTimer.current && curPosition >= e.nativeEvent.contentSize.height) {
      scrollEndTimer.current = setTimeout(() => {
        scrollEndTimer.current = null
      }, 500)

      onScrollEnd && onScrollEnd(e)
    }
  }

  const mathSeacrh = scrollPosition => {
    return parseInt(scrollPosition / sizeItem)
  }

  const binarySeacrh = ({ start, end, scrollPosition }) => {
    scrollPosition = parseInt(scrollPosition)
    if (!children || !children[0]) return null
    if (start === 0 && end === 0) return 0
    if (start >= end) return start

    let mid = Math.floor((start + end) / 2)
    if (!itemsInfo[mid]) {
      return binarySeacrh({
        start: mid + 1,
        end,
        scrollPosition
      })
    }

    if (itemsInfo[mid].position <= scrollPosition) {
      let findNextItem
      for (let i = mid + 1; i < itemsInfo.length; i++) {
        if (itemsInfo[i]) {
          findNextItem = itemsInfo[i]
          break
        }
      }
      if (findNextItem.position > scrollPosition) {
        return mid
      }
    }

    if (itemsInfo[mid].position < scrollPosition) {
      return binarySeacrh({
        start: mid + 1,
        end,
        scrollPosition
      })
    }

    if (itemsInfo[mid].position > scrollPosition) {
      return binarySeacrh({
        start,
        end: mid - 1,
        scrollPosition
      })
    }
  }

  const onRenderScroll = e => {
    setScrollHeight(e.nativeEvent.layout.height)
    onLayout && onLayout(e)
  }

  const sliceInfo = getSliceInfo()
  const renderItems = React.Children.toArray(children).map((child, index) => {
    return pug`
      Item(
        key=index
        index=index
        sizeItem=sizeItem
        itemsInfo=itemsInfo
        onChangeInfoItems=info => setItemsInfo(info)
      )= child
    `
  }).slice(sliceInfo.start, sliceInfo.end)

  return pug`
    ScrollView(
      ref=ref
      scrollEventThrottle=1
      onLayout=onRenderScroll
      onScroll=_onScroll
    )
      View(style=styleView)= renderItems
  `
}

export default observer(Slicer)
