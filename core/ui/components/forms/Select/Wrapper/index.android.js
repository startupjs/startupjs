// ref: https://github.com/lawnstarter/react-native-picker-select/blob/master/src/index.js
import React from 'react'
import { Picker } from '@react-native-picker/picker'
import { pug, observer } from 'startupjs'
import {
  stringifyValue,
  getLabel,
  parseValue,
  NULL_OPTION
} from './helpers'
import Div from '../../../Div'
import themed from '../../../../theming/themed'
import './index.styl'

function SelectWrapper ({
  style,
  children,
  options = [],
  value,
  disabled,
  showEmptyValue,
  emptyValueLabel,
  onChange
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
          if showEmptyValue
            Picker.Item(
              key=-1
              value=stringifyValue(NULL_OPTION)
              label=emptyValueLabel || getLabel(NULL_OPTION)
            )
          each item, index in options
            Picker.Item(
              key=index
              value=stringifyValue(item)
              label=getLabel(item)
            )
  `
}

export default observer(themed('Select', SelectWrapper))
