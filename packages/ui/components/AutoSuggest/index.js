import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import TextInput from '../forms/TextInput'
import Popover from '../popups/Popover'
import Menu from '../Menu'
import Slicer from '../Slicer'
import Loader from '../Loader'
import propTypes from 'prop-types'
import './index.styl'

const AutoSuggest = ({
  options,
  value,
  placeholder,
  popoverHeight,
  renderItem,
  isLoading,
  onChange,
  onDismiss,
  onChangeText,
  onScrollEnd
}) => {
  const [inputValue, setInputValue] = useState('')
  const [isFocus, setIsFocus] = useState(false)

  let _data = options.filter((item, index) => {
    return inputValue ? !!item.label.match(new RegExp('^' + inputValue, 'gi')) : true
  })

  function onFocus () {
    setIsFocus(true)
  }

  function onBlur () {
    if (!_data.length) return
    setIsFocus(false)
    setInputValue('')
    onDismiss()
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

  const _onChangeText = t => {
    setInputValue(t)
    onChangeText(t)
  }

  return pug`
    Popover(
      height=popoverHeight
      visible=(isFocus && (isLoading || !!_data.length))
      positionHorizontal="right"
      hasWidthCaption=true
      onDismiss=onBlur
    )
      Popover.Caption
        TextInput(
          placeholder=placeholder
          onFocus=onFocus
          onChangeText=_onChangeText
          value=(!isFocus && value.label) || inputValue
        )
      if isLoading
        View.loaderCase
          Loader(size='s')
      else
        Slicer(
          countVisibleElements=10
          countNearElements=10
          onScrollEnd=onScrollEnd
        )= renderItems
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
