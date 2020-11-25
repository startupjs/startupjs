import React, { useState, useEffect, useRef } from 'react'
import { View, TouchableOpacity, Platform } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import TextInput from '../forms/TextInput'
import Popover from '../popups/Popover'
import Menu from '../Menu'
import Slicer from '../Slicer'
import Loader from '../Loader'
import './index.styl'

// TODO: key event change scroll
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
  const _data = useRef([])
  const [inputValue, setInputValue] = useState('')
  const [selectIndexValue, setSelectIndexValue] = useState(-1)
  const [isFocus, setIsFocus] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (Platform.OS !== 'web') return

    if (isOpen) {
      document.onkeydown = onKeyDown
    } else {
      document.keydown = null
      setSelectIndexValue(-1)
    }
  }, [isOpen, selectIndexValue])

  useEffect(() => {
    setIsFocus(false)
    setIsOpen(false)
  }, [value])

  _data.current = options.filter((item, index) => {
    return inputValue ? !!item.label.match(new RegExp('^' + inputValue, 'gi')) : true
  })

  function onFocus () {
    setIsFocus(true)
  }

  function onBlur () {
    if (!_data.current.length) return
    setInputValue('')
    setIsFocus(false)
    setIsOpen(false)
    onDismiss && onDismiss()
  }

  function _onChangeText (t) {
    if (!isOpen) return
    setInputValue(t)
    setSelectIndexValue(-1)
    onChangeText && onChangeText(t)
  }

  function onKeyDown (e) {
    let item, index
    const keyName = e.key

    switch (keyName) {
      case 'ArrowUp':
        e.preventDefault()
        if (selectIndexValue === 0 || (selectIndexValue === -1 && !value.value)) return

        index = selectIndexValue - 1
        if (selectIndexValue === -1 && value.value) {
          index = _data.current.findIndex(item => item.value === value.value)
          index--
        }

        setSelectIndexValue(index)
        break

      case 'ArrowDown':
        e.preventDefault()
        if (selectIndexValue === _data.current.length - 1) return

        index = selectIndexValue + 1
        if (selectIndexValue === -1 && value) {
          index = _data.current.findIndex(item => item.value === value.value)
          index++
        }

        setSelectIndexValue(index)
        break

      case 'Enter':
        e.preventDefault()
        if (selectIndexValue === -1) return
        item = _data.current.find((_, i) => i === selectIndexValue)
        onChange && onChange(item)
        break
    }
  }

  const renderItems = _data.current.map((item, index) => {
    if (renderItem) {
      return pug`
        TouchableOpacity(
          key=index
          onPress=()=> onChange && onChange(item)
        )= renderItem(item, index, selectIndexValue)
      `
    }

    return pug`
      Menu.Item(
        key=index
        styleName={ selectMenu: selectIndexValue === index }
        onPress=()=> onChange && onChange(item)
        active=item.value === value.value
      )= item.label
    `
  })

  if (!style.maxHeight) style.maxHeight = 200
  return pug`
    Popover(
      wrapperStyle=style
      wrapperStyleName='wrapper'
      visible=(isFocus || isLoading)
      position='bottom'
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
            TouchableOpacity(onPress=onFocus)
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
