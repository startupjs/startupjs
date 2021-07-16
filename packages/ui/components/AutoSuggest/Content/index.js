import React, { useState } from 'react'
import { View, FlatList, Platform } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { observer } from 'startupjs'
import Drawer from '../../popups/Drawer'
import Loader from '../../Loader'
import './index.styl'

export default observer(function Content ({
  isShow,
  value,
  refCaption,
  isLoading,
  renderItem,
  multiselect,
  data,
  onChange,
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

  let content = null
  if (multiselect || Platform.OS !== 'ios') {
    content = pug`
      if isLoading
        View.loader
          Loader(size='s')
      else
        FlatList(
          data=data
          keyboardShouldPersistTaps="always"
          extraData=data
          renderItem=renderItem
          keyExtractor=item=> item.value
          scrollEventThrottle=500
          onScroll=onScroll
          onLayout=onLayoutWrapper
          onContentSizeChange=onChangeSizeScroll
        )
    `
  } else {
    content = pug`
      Picker.picker(
        selectedValue=value.value
        onValueChange=(value, index)=> onChange(data[index])
      )
        each item in data
          Picker.Item(
            value=item.value
            label=item.label
          )
    `
  }

  function onDismiss () {
    if (!multiselect && Platform.OS !== 'web') {
      refCaption.current.blur()
    }
    onChangeShow(false)
  }

  return pug`
    if data.length
      Drawer.drawer(
        visible=(isShow || isLoading)
        position='bottom'
        overlayStyleName='drawerOverlay'
        swipeStyleName='drawerSwipe'
        durationOpen=200
        durationHide=200
        onDismiss=onDismiss
      )= content
  `
})
