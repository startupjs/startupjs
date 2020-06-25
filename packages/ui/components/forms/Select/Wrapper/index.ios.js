// ref: https://github.com/lawnstarter/react-native-picker-select/blob/master/src/index.js
import React, { useState } from 'react'
import { Picker, Modal, TouchableOpacity, View, Text } from 'react-native'
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
  const [showModal, setShowModal] = useState(false)

  function onValueChange (value) {
    if (onChange) onChange(parseValue(value))
  }

  return pug`
    Div.root(style=style)
      = children
      if !disabled
        TouchableOpacity.overlay(
          activeOpacity=1
          onPress=() => setShowModal(true)
        )
        Modal(
          visible=showModal
          transparent
          animationType='slide'
        )
          TouchableOpacity.modalTop(
            onPress=() => setShowModal(false)
          )
          View.modalMiddle
            TouchableOpacity(
              onPress=() => setShowModal(false)
              hitSlop={ top: 4, right: 4, bottom: 4, left: 4 }
            )
              Text.done Done
          View.modalBottom
            Picker(
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
