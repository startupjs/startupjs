/* eslint-disable no-unreachable */
import React, { useMemo } from 'react'
import { ScrollView } from 'react-native'
import { observer, styl, useValue, useSession } from 'startupjs'
import {
  Button,
  Div,
  Pagination,
  Row,
  Span,
  TextInput
} from '@startupjs/ui'
import axios from 'axios'
import Translations from './Translations'

const LIMIT = 10

export default observer(function PInternationalization ({
  style
}) {
  const [defaultTranslations, $defaultTranslations] =
    useSession('_defaultTranslations')

  if (!defaultTranslations) {
    throw axios.post('/api/i18n/get-translations').then(({ data }) => {
      $defaultTranslations.set(data)
    })
  }

  const [search, $search] = useValue('')
  const [skip, $skip] = useValue(0)
  const defaultTranslationKeys = useMemo(() => {
    return Object.keys(defaultTranslations)
  }, [])

  const foundTranslationKeys = useMemo(() => {
    if (!search) return defaultTranslationKeys
    return defaultTranslationKeys.filter(key => key.includes(search))
  }, [search])

  const displayTranslationKeys = useMemo(() => {
    return foundTranslationKeys.slice(skip, skip + LIMIT)
  }, [skip, foundTranslationKeys.length])

  return pug`
    Div.root
      Row.header(align='between')
        TextInput.search(
          placeholder='Seach by filename'
          value=search
          onChangeText=(val) => {
            $skip.set(0)
            $search.set(val)
          }
        )
        Button.button(
          color='primary'
          variant='flat'
          onPress=() => {}
        ) Save

      ScrollView
        each translationKey, translationKeyIndex in displayTranslationKeys
          Div.translation(
            key=translationKey
            styleName={ even: !(translationKeyIndex % 2) }
          )
            Span.translationKey= translationKey
            Translations(translationKey=translationKey)
      Row.pagination(align='center')
        Pagination(
          variant='compact'
          count=foundTranslationKeys.length
          limit=LIMIT
          $skip=$skip
          onChangePage=page => $skip.set(page * LIMIT)
        )
  `

  styl`
    .root
      flex-grow 1
      flex-shrink 1

    .header
      padding 2u

    .search
      max-width 30u
      flex-grow 1

    .button
      margin-left 2u

    .translation
      padding 1u 2u

      &.even
        background-color $UI.colors.darkLightest

      &Key
        padding-bottom 0.5u
        border-bottom 1px solid $UI.colors.dark
        font(l)

    .pagination
      padding 1u
      border-top: 1px solid $UI.colors.darkLighter
  `
})
