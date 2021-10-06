import { useState, useMemo } from 'react'
import escapeRegExp from 'lodash/escapeRegExp'

export default function useSearch ({ options, onChangeText }) {
  const [searchValue, setSearchValue] = useState('')

  function onChangeSearch (text) {
    setSearchValue(text)
    onChangeText && onChangeText(text)
  }

  const escapedValue = useMemo(() => escapeRegExp(searchValue), [searchValue])

  const prepareOptions = options.filter(item => {
    return new RegExp(escapedValue, 'gi').test(item.label)
  })

  return {
    searchValue,
    prepareOptions,
    onChangeSearch
  }
}
