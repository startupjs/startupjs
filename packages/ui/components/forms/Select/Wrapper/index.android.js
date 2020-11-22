// ref: https://github.com/lawnstarter/react-native-picker-select/blob/master/src/index.js
import React from 'react'
// TODO: Change to @react-native-picker/picker when the issue is closed https://github.com/react-native-picker/picker/issues/175
import { Picker } from 'react-native'
import { observer } from 'startupjs'
import {
  stringifyValue,
  getLabel,
  parseValue,
  NULL_OPTION
} from './helpers'
import Div from '../../../Div'
import './index.styl'

export default observer(function SelectWrapper ({
  children,
  style,
  disabled,
  options,
  showEmptyValue,
  value,
  onChange
}) {
  function onValueChange (value) {
    if (onChange) onChange(parseValue(value))
  }

  const items = options.map((item, index) => pug`
    Picker.Item(
      key=index
      value=stringifyValue(item)
      label=getLabel(item)
    )
  `)

  showEmptyValue && items.unshift(pug`
    Picker.Item(
      key=-1
      value=stringifyValue(NULL_OPTION)
      label=getLabel(NULL_OPTION)
    )
  `)

  return pug`
    Div.root(style=style)
      = children
      if !disabled
        Picker.overlay(
          selectedValue=stringifyValue(value)
          onValueChange=onValueChange
        )= items
  `
})
