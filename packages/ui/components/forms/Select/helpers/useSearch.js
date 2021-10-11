import { useMemo } from 'react'
import { useValue } from 'startupjs'
import escapeRegExp from 'lodash/escapeRegExp'

export default function useSearch ({ options, onChangeText }) {
  const [searchValue, $searchValue] = useValue('')

  function onChangeSearch (text) {
    $searchValue.set(text)
    onChangeText && onChangeText(text)
  }

  const escapedValue = useMemo(() => escapeRegExp(searchValue), [searchValue])

  const prepareOptions = options.filter(item => {
    return new RegExp(escapedValue, 'gi').test(item.label)
  })

  return {
    searchValue,
    $searchValue,
    prepareOptions,
    onChangeSearch
  }
}
