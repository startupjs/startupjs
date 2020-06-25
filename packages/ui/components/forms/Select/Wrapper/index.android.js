// ref: https://github.com/lawnstarter/react-native-picker-select/blob/master/src/index.js
import React from 'react'
import { Picker } from 'react-native'
import { observer } from 'startupjs'
import Div from '../../../Div'
import './index.styl'
import {
  stringifyValue,
  getLabel,
  parseValue,
  NULL_OPTION
} from './helpers'

export default observer(function SelectWrapper ({
  options = [],
  value,
  onChange,
  disabled,
  style,
  children
}) {
  function onValueChange (value) {
    if (onChange) onChange(parseValue(value))
  }

  return pug`
    Div.root(style=style)
      = children
      if !disabled
        Picker.overlay(
          selectedValue=stringifyValue(value)
          onValueChange=onValueChange
        )
          Picker.Item(
            key=-1
            value=stringifyValue(NULL_OPTION)
            label=getLabel(NULL_OPTION)
          )
          each item, index in options
            Picker.Item(
              key=index
              value=stringifyValue(item)
              label=getLabel(item)
            )
  `
})
