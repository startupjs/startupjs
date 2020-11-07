import React, { useState, useEffect } from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import TextInput from '../forms/TextInput'
import Popover from '../popups/Popover'
import Menu from '../Menu'
import Slicer from '../Slicer'
import Loader from '../Loader'
import './index.styl'

function AutoSuggest ({
  style,
  options,
  value,
  placeholder,
  renderItem,
  isLoading,
  onChange,
  onDismiss,
  onChangeText,
  onScrollEnd
}) {
  const [inputValue, setInputValue] = useState('')
  const [isFocus, setIsFocus] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  let _data = options.filter((item, index) => {
    return inputValue ? !!item.label.match(new RegExp('^' + inputValue, 'gi')) : true
  })

  function onFocus () {
    setIsFocus(true)
  }

  function onBlur () {
    if (!_data.length) return
    setInputValue('')
    setIsFocus(false)
    setIsOpen(false)
    onDismiss && onDismiss()
  }

  useEffect(() => {
    setIsFocus(false)
    setIsOpen(false)
  }, [value])

  const renderItems = _data.map((item, index) => {
    if (renderItem) return renderItem(item, index)
    return pug`
      Menu.Item(
        key=index
        onPress=()=> onChange && onChange(item)
        active=item.value === value.value
      )= item.label
    `
  })

  const _onChangeText = t => {
    if (!isOpen) return
    setInputValue(t)
    onChangeText && onChangeText(t)
  }

  if (!style.maxHeight) style.maxHeight = 200
  return pug`
    Popover(
      wrapperStyle=style
      visible=(isFocus || isLoading)
      position='bottom'
      placements=['bottom-center', 'top-center']
      hasWidthCaption=true
      durationOpen=200
      durationClose=200
      onRequestOpen=()=> setIsOpen(true)
      onDismiss=onBlur
    )
      Popover.Caption
        View.captionCase
          TextInput(
            placeholder=placeholder
            onChangeText=_onChangeText
            onFocus=onFocus
            autoFocus=isFocus
            value=(!isFocus && value.label) || inputValue
          )
          if !isFocus
            TouchableWithoutFeedback(onPress=onFocus)
              View.click
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
  style: {},
  options: [],
  placeholder: 'Select value',
  value: {},
  renderItem: null,
  isLoading: false
}

AutoSuggest.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string
  }).isRequired,
  placeholder: PropTypes.string,
  renderItem: PropTypes.func,
  isLoading: PropTypes.bool,
  onChange: PropTypes.func,
  onDismiss: PropTypes.func,
  onChangeText: PropTypes.func,
  onScrollEnd: PropTypes.func
}

export default observer(AutoSuggest)
