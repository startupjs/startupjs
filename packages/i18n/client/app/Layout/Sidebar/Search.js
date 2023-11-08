/* eslint-disable no-unreachable */
import React, { useCallback } from 'react'
import { pug, observer, useValue, styl } from 'startupjs'
import { TextInput } from '@startupjs/ui'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import usePage from './../../../usePage'

export default observer(function Search () {
  const [search, $search] = useValue()
  const [, $pageSearch] = usePage('search')

  const onChangeText = useCallback((text) => {
    $search.set(text)
  }, [])

  const onSubmit = useCallback(({ nativeEvent: { text } }) => {
    $pageSearch.setDiff(text)
  })

  return pug`
    TextInput.root(
      icon=faSearch
      placeholder='Search by filename'
      value=search
      onChangeText=onChangeText
      onSubmitEditing=onSubmit
    )
  `

  styl`
    .root
      &:part(icon)
        color var(--color-text-placeholder)
  `
})
