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
  const [inputValue, setInputValue] = useState('')
  const [isFocus, setIsFocus] = useState(false)

  let _data = options.filter((item, index) => {
    return inputValue ? !!item.label.match(new RegExp('^' + inputValue, 'gi')) : true
  }).splice(0, 30)

  function onFocus () {
    setIsFocus(true)
  }

  function onBlur () {
    if (!_data.length) return
    setIsFocus(false)
    setInputValue('')
  }

  useEffect(() => {
    setIsFocus(false)
    setInputValue('')
  }, [value])

  const renderItems = _data.map((item, index) => {
    if (renderItem) return renderItem(item, index)
    return pug`
      Menu.Item(
        key=index
        onPress=()=> onChange(item)
        active=item.value === value.value
      )= item.label
    `
  })

  return pug`
    Popover(
      height=popoverHeight
      visible=(!!_data.length && isFocus)
      positionHorizontal="right"
      onDismiss=onBlur
    )
      Popover.Caption
        TextInput(
          placeholder=placeholder
          onFocus=onFocus
          onChangeText=t=> setInputValue(t)
          value=(!isFocus && value.label) || inputValue
        )
      ScrollView
        Menu= renderItems
  `
}

AutoSuggest.defaultProps = {
  options: [],
  placeholder: 'Select value',
  popoverHeight: 300,
  value: {},
  renderItem: null
}

AutoSuggest.propTypes = {
  options: propTypes.array.isRequired,
  value: propTypes.shape({
    value: propTypes.string,
    label: propTypes.string
  }).isRequired,
  placeholder: propTypes.string,
  popoverHeight: propTypes.number,
  renderItem: propTypes.func,
  onChange: propTypes.func
}

export default AutoSuggest
