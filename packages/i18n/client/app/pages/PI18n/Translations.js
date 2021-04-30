/* eslint-disable no-unreachable */
import React, { useRef, useLayoutEffect, useCallback } from 'react'
import { FlatList } from 'react-native'
import { observer, styl } from 'startupjs'
import { Button, Div, Dropdown, Row, Span } from '@startupjs/ui'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import SubTranslations from './SubTranslations'
import usePage from './../../../usePage'
import { decodePath } from './../../../../isomorphic'

export default observer(function Translations () {
  const flatListRef = useRef()
  const [{ displayTranslations, type, filter }] = usePage()

  const renderTranslation = useCallback(({ item, index }) => {
    const translationKey = item.key

    return pug`
      Div.translation(styleName={ even: !(index % 2) })
        Span.translationKey= decodePath(translationKey)
        SubTranslations(
          translationKey=translationKey
          subTranslations=item.subTranslations
        )
    `
  }, [])

  // TODO
  useLayoutEffect(() => {
    // if (!flatListRef) return
    flatListRef.current.scrollToIndex({ animated: false, index: 0 })
  }, [type, filter])

  // TODO
  const onMenuChange = useCallback(value => {
    switch (value) {
      case 'unsued':
        console.log('unsued')
        break
      default:
        alert('Not supported')
    }
  })

  return pug`
    Div.root
      Row.header(align='right')
        //- TODO
        Button(
          color='primary'
          variant='flat'
          onPress=() => {}
        ) Save
        Dropdown(
          onChange=onMenuChange
        )
          Dropdown.Caption
            Button.menu(
              variant='text'
              icon=faEllipsisV
            )
          Dropdown.Item(value='unused' label='Remove unused')
          Dropdown.Item(value='import' label='Import a file')
          Dropdown.Item(value='export' label='Export as file')
      FlatList(
        ref=flatListRef
        data=displayTranslations
        renderItem=renderTranslation
        initialNumToRender=2
      )
  `

  // test initialNumToRender on small areas
  // removeClippedSubviews
  // TODO check android https://stackoverflow.com/a/66703331

  styl`
    .root
      flex-grow 1
      flex-shrink 1
    .header
      padding 1u 2u
      border-bottom: 1px solid $UI.colors.darkLighter
    .menu
      margin-left 1u
    .translation
      padding-left 2u
      padding-right @padding-left
      &.even
        background-color $UI.colors.darkLightest
      &Key
        padding-top 1u
        padding-bottom 0.5u
        border-bottom 1px solid $UI.colors.dark
        font(l)
  `
})
