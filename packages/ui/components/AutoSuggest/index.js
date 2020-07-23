import React, { useState, useEffect } from 'react'
import { ScrollView } from 'react-native'
import TextInput from '../forms/TextInput'
import Popover from '../popups/Popover'
import Menu from '../Menu'
import propTypes from 'prop-types'

const AutoSuggest = ({
  data,
  placeholder,
  popoverHeight,
  renderItem,
  onChange
}) => {
  const [inputValue, setInputValue] = useState()
  const [selectedItem, setSelectedItem] = useState({})
  const [focused, setFocused] = useState(false)

  function onFocus () {
    setFocused(true)
  }
  function onBlur () {
    setFocused(false)
    setInputValue()
  }

  function onChangeText (text) {
    setInputValue(text)
  }

  function _onChange (item) {
    onChange && onChange(item)
    setSelectedItem(item)
  }

  let _data = data.filter((item, index) => {
    return inputValue ? !!item.label.match(new RegExp('^' + inputValue, 'gi')) : true
  }).splice(0, 30)

  const renderItems = _data.map((item, index) => {
    if (renderItem) return renderItem(item, index, _onChange)
    return pug`
      Menu.Item(
        key=index
        onPress=()=> _onChange(item)
        active=item.label === inputValue
      )= item.label
    `
  })

  return pug`
    Popover(
      height=popoverHeight
      visible=(!!_data.length && focused)
      positionHorizontal="right"
      onDismiss=()=> {}
    )
      Popover.Caption
        TextInput(
          placeholder=placeholder
          onFocus=onFocus
          onBlur=onBlur
          onChangeText=onChangeText
          value=(!focused && selectedItem.label) || inputValue
        )
      ScrollView
        Menu= renderItems
  `
}

AutoSuggest.defaultProps = {
  data: [],
  placeholder: 'Select value',
  popoverHeight: 300,
}

AutoSuggest.propTypes = {
  placeholder: propTypes.string,
  popoverHeight: propTypes.number,
  data: propTypes.array,
  renderItem: propTypes.func,
  onChange: propTypes.func
}

export default AutoSuggest
