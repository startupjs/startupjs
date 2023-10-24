import React from 'react'
import { pug, observer } from 'startupjs'
import {
  stringifyValue,
  getLabel,
  parseValue,
  NULL_OPTION
} from './helpers'
import Div from '../../../Div'
import themed from '../../../../theming/themed'
import STYLES from './index.styl'

function SelectWrapper ({
  style,
  children,
  options = [],
  value,
  disabled,
  showEmptyValue,
  emptyValueLabel,
  testID,
  onChange
}) {
  function onSelectChange (event) {
    const value = event.target.value
    if (onChange) onChange(parseValue(value))
  }

  return pug`
    Div.root(style=style testID=testID)
      = children
      if !disabled
        select(
          style=STYLES.overlay
          value=stringifyValue(value)
          onChange=onSelectChange
        )
          if showEmptyValue
            option(key=-1 value=stringifyValue(NULL_OPTION))
              = emptyValueLabel || getLabel(NULL_OPTION)
          each item, index in options
            option(key=index value=stringifyValue(item))
              = getLabel(item)
  `
}

export default observer(themed('Select', SelectWrapper))
