import React, { useRef } from 'react'
import { TextInput } from 'react-native'
import { observer, u, useValue } from 'startupjs'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { useSearch } from '../helpers'
import Div from '../../../Div'
import Row from '../../../Row'
import Icon from '../../../Icon'
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
  const changeShowTimer = useRef()

  const [visible, $visible] = useValue(false)
  const {
    searchValue,
    $searchValue,
    prepareOptions,
    onChangeSearch
  } = useSearch({ options, onChangeText })

  function _onChange (item) {
    onChangeSearch('')

    if (multiSelect) {
      const index = value.findIndex(i => i.value === item.value)

      if (index !== -1) value.splice(index, 1)
      else value.push(item)

      onChange && onChange([...value])

      if (visible) onShow()
    } else {
      onChange && onChange(item)
    }
  }

  function onBackspace () {
    if (!$searchValue.get()) _onChange(value[value.length - 1])
  }

  function onBlur () {
    changeShowTimer.current = setTimeout(() => $visible.set(false), 100)
  }

  function onShow () {
    clearTimeout(changeShowTimer.current)
    refInput.current.focus()
  }

  return pug`
    Div.wrapper(
      ref=refAnchor
      onPress=onShow
    )
      if multiSelect
        each item, index in value
          Row.tag
            Span= item.label
            Div(onPress=()=> _onChange(item))
              Icon.tagIcon(icon=faTimes)
      else if !visible
        Span= value.label

      if search
        TextInput.input(
          ref=refInput
          value=searchValue
          style=[style, { width: searchValue.length * u(1) }]
          onChangeText=t=> onChangeSearch(t)
          onFocus=()=> $visible.set(true)
          onBlur=onBlur
        )

    AbstractDropdown(
      visible=visible
      value=value
      options=prepareOptions
      refAnchor=refAnchor
      onChange=_onChange
      onBackspace=onBackspace
      onChangeVisible=v=> $visible.set(v)
    )
  `
}

export default observer(AdvancedSelect)
