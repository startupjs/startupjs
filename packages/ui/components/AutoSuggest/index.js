import React, { useState, useEffect } from 'react'
import { ScrollView } from 'react-native'
import TextInput from '../forms/TextInput'
import Popover from '../popups/Popover'
import Menu from '../Menu'
import propTypes from 'prop-types'

const AutoSuggest = ({
  options,
  value,
  placeholder,
  popoverHeight,
  renderItem,
  onChange
}) => {
  const [selectedItem, setSelectedItem] = useState({})
  const [inputValue, setInputValue] = useState()
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

  let _data = options.filter((item, index) => {
    return inputValue ? !!item.label.match(new RegExp('^' + inputValue, 'gi')) : true
  }).splice(0, 30)

  const renderItems = _data.map((item, index) => {
    if (renderItem) return renderItem(item, index)
    return pug`
      Menu.Item(
        key=index
        onPress=()=> _onChange(item)
        active=item.value === selectedItem.value
      )= item.label
    `
  })

  useEffect(() => {
    if (value && (value.value !== selectedItem.value)) {
      const item = options.find((option) => option.value === value.value)
      item && setSelectedItem(item)
    }
  }, [JSON.stringify(value)])

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
  options: [],
  placeholder: 'Select value',
  popoverHeight: 300,
  value: null
}

AutoSuggest.propTypes = {
  placeholder: propTypes.string,
  popoverHeight: propTypes.number,
  options: propTypes.array,
  value: propTypes.oneOfType([
    propTypes.shape({value: propTypes.string, label: propTypes.string}),
    propTypes.instanceOf(null)
  ]),
  renderItem: propTypes.func,
  onChange: propTypes.func
}

export default AutoSuggest
