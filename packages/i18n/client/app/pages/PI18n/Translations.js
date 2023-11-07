/* eslint-disable no-unreachable */
import React, { useRef, useCallback } from 'react'
import { Platform } from 'react-native'
import { pug, observer, styl, useDidUpdate } from 'startupjs'
import { FlatList } from '@startupjs/ui'
import usePage from './../../../usePage'
import DefaultLang from './DefaultLang'
import Filename from './Filename'
import Key from './Key'
import Lang from './Lang'

const isAndroid = Platform.OS === 'android'

const flatListComponentsMapping = {
  filename: Filename,
  key: Key,
  lang: Lang,
  defaultLang: DefaultLang
}

export default observer(function Translations () {
  const flatListRef = useRef()
  const [{ displayTranslations, state }] = usePage()

  const renderItem = useCallback(({ item }) => {
    const Item = flatListComponentsMapping[item.type]
    return pug`
      // we use a fixed height to improve perfomance of the FlatList
      Item.item(
        styleName={ even: !(item.index % 2) }
        meta=item
      )
    `

    styl`
      .item
        padding-left 2u
        padding-right @padding-left

        &.even
          background-color var(--color-bg)
    `
  }, [])

  useDidUpdate(() => {
    flatListRef.current.scrollToIndex({ animated: false, index: 0 })
  }, [state])

  // HACK `removeClippedSubviews=false`for android
  // https://stackoverflow.com/a/66703331
  return pug`
    FlatList(
      ref=flatListRef
      data=displayTranslations
      renderItem=renderItem
      initialNumToRender=40
      removeClippedSubviews=isAndroid ? false : true
      maxToRenderPerBatch=20
      windowSize=7
    )
  `
})
