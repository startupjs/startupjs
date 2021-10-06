import React, { useRef, useState } from 'react'
import { TextInput } from 'react-native'
import { observer, u } from 'startupjs'
import { useSearch } from '../helpers'
import Div from '../../../Div'
import Span from '../../../typography/Span'
import AbstractDropdown from '../../../AbstractDropdown'
import './index.styl'

function AdvancedSelect ({
  style,
  children,
  options = [],
  value,
  disabled,
  search,
  multiSelect,
  showEmptyValue,
  onChange,
  onChangeText
}, ref) {
  const refAnchor = useRef()
  const refInput = useRef()

  const [visible, setVisible] = useState(false)
  const {
    searchValue,
    prepareOptions,
    onChangeSearch
  } = useSearch({ options, onChangeText })

  function onChangeShow () {
    setVisible(true)
    if (search) refInput.current.focus()
  }

  function _onChange (item) {
    onChangeSearch('')

    if (multiSelect) {
      const index = value.findIndex(i => i.value === item.value)

      if (index !== -1) value.splice(index, 1)
      else value.push(item)

      onChange && onChange([...value])
    } else {
      onChange && onChange(item)
    }
  }

  return pug`
    Div.wrapper(
      ref=refAnchor
      onPress=onChangeShow
    )
      if multiSelect
        each item, index in value
          Div.tag
            Span= item.label
      else if !visible
        Span= value.label

      if search
        TextInput.input(
          ref=refInput
          value=searchValue
          style=[style, { width: searchValue.length * u(1) }]
          onChangeText=t=> onChangeSearch(t)
        )

    AbstractDropdown(
      visible=visible
      value=value
      options=prepareOptions
      refAnchor=refAnchor
      onChange=_onChange
      onChangeVisible=v=> setVisible(v)
    )
  `
}

export default observer(AdvancedSelect)
