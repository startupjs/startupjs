/* @jsx unstable_createElement */
import React from 'react'
// eslint-disable-next-line
import { unstable_createElement } from 'react-native'
import { observer } from 'startupjs'
import {
  stringifyValue,
  getLabel,
  parseValue
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
  onChange
}) {
  function onSelectChange (event) {
    const value = event.target.value
    if (onChange) onChange(parseValue(value))
  }

  return pug`
    Div.root(style=style)
      = children
      if !disabled
        select.overlay(
          value=stringifyValue(value)
          onChange=onSelectChange
        )
          each item, index in options
            option(key=index value=stringifyValue(item))
              = getLabel(item)
  `
}

export default observer(themed('Select', SelectWrapper))
