import React, { useState } from 'react'
import { View, FlatList } from 'react-native'
import { observer } from 'startupjs'
import AnimatedSpawn from '../../popups/Popover/AnimatedSpawn'
import Div from '../../Div'
import Loader from '../../Loader'
import './index.styl'

const SUPPORT_PLACEMENTS = [
  'bottom-start',
  'bottom-center',
  'bottom-end',
  'top-start',
  'top-center',
  'top-end'
]

export default observer(function Content ({
  style,
  data,
  refCaption,
  isShow,
  isLoading,
  renderItem,
  onChangeShow,
  onScrollEnd
}) {
  const [wrapperHeight, setWrapperHeight] = useState()
  const [scrollHeightContent, setScrollHeightContent] = useState()

  function onScroll ({ nativeEvent }) {
    if (nativeEvent.contentOffset.y + wrapperHeight === scrollHeightContent) {
      onScrollEnd && onScrollEnd()
    }
  }

  function onLayoutWrapper ({ nativeEvent }) {
    setWrapperHeight(nativeEvent.layout.height)
  }

  function onChangeSizeScroll (width, height) {
    setScrollHeightContent(height)
  }

  const content = pug`
    if isLoading
      View.loader
        Loader(size='s')
    else
      FlatList(
        data=data
        extraData=data
        renderItem=renderItem
        keyExtractor=item=> item.value
        scrollEventThrottle=500
        onScroll=onScroll
        onLayout=onLayoutWrapper
        onContentSizeChange=onChangeSizeScroll
      )
  `

  return pug`
    AnimatedSpawn.content(
      visible=(isShow || isLoading)
      refCaption=refCaption
      hasWidthCaption=(!style.width && !style.maxWidth)
      placements=SUPPORT_PLACEMENTS
      durationOpen=200
      durationClose=200
      animateType='opacity'
      renderWrapper=children=> children
      onRequestClose=()=> onChangeShow(false)
    )
      Div(nativeID='popoverContent')= content
  `
})
