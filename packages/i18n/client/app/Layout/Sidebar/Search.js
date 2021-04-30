import React, { useCallback } from 'react'
import { observer, useValue } from 'startupjs'
import { TextInput } from '@startupjs/ui'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import usePage from './../../../usePage'
import './index.styl'

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
    TextInput(
      icon=faSearch
      iconStyleName='searchIcon'
      placeholder='Search by filename'
      value=search
      onChangeText=onChangeText
      onSubmitEditing=onSubmit
    )
  `
})
