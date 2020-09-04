import React, { useRef, useState } from 'react'
import { View, ScrollView } from 'react-native'
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
    for (let i = 0; i < sliceInfo.start; i++) {
      paddingTop += itemsInfo[i].size
    }

    setStyleView({ paddingTop })
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
    if (!children || !children[0]) return null
    if (start === 0 && end === 0) return 0
    if (start >= end) return start

    const mid = Math.floor((start + end) / 2)

    if (itemsInfo[mid].position <= scrollPosition &&
      (!itemsInfo[mid + 1] || itemsInfo[mid + 1].position > scrollPosition)) {
      return mid
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

export default Slicer
