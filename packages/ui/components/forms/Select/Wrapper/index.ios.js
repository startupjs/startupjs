// ref: https://github.com/lawnstarter/react-native-picker-select/blob/master/src/index.js
import React, { useState } from 'react'
import { Modal } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { observer } from 'startupjs'
import {
  stringifyValue,
  getLabel,
  parseValue
} from './helpers'
import Span from '../../../typography/Span'
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
  const [showModal, setShowModal] = useState(false)

  function onValueChange (value) {
    if (onChange) onChange(parseValue(value))
  }

  return pug`
    Div.root(style=style)
      = children
      if !disabled
        Div.overlay(
          activeOpacity=1
          onPress=() => setShowModal(true)
        )
        Modal(
          visible=showModal
          transparent
          animationType='slide'
        )
          Div.modalTop(onPress=()=> setShowModal(false))
          Div.modalMiddle
            Div(
              onPress=()=> setShowModal(false)
              hitSlop={ top: 4, right: 4, bottom: 4, left: 4 }
            )
              Span.done Done
          Div.modalBottom
            Picker(
              selectedValue=stringifyValue(value)
              onValueChange=onValueChange
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
