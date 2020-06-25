/* @jsx unstable_createElement */
import React from 'react'
// eslint-disable-next-line
import { unstable_createElement } from 'react-native'
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
  function onSelectChange (event) {
    const value = event.target.value
    if (onChange) onChange(parseValue(value))
  }

  return pug`
    Div.root(style=style)
      = children
      if !disabled
        select.overlay(value=stringifyValue(value) onChange=onSelectChange)
          option(key=-1 value=stringifyValue(NULL_OPTION))
            = getLabel(NULL_OPTION)
          each item, index in options
            option(key=index value=stringifyValue(item))
              = getLabel(item)
  `
})
