import React, { useState, useRef } from 'react'
import { TouchableOpacity, Platform, View } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import TextInput from '../forms/TextInput'
import Menu from '../Menu'
import Popover from '../popups/Popover'
import Slicer from '../Slicer'
import Loader from '../Loader'
import useKeyboard from './useKeyboard'
import './index.styl'

// TODO: KeyboardAvoidingView
// onRegExRequest
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
  const refInput = useRef()

  const [isShow, setIsShow] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [selectIndexValue, setSelectIndexValue, onKeyPress] = useKeyboard({
    isShow,
    _data,
    value,
    onChange,
    onChangeShow: v => setIsShow(v)
  })

  _data.current = options.filter(item => {
    return inputValue ? !!item.label.match(new RegExp(inputValue, 'gi')) : true
  })

  function onClose (e) {
    setIsShow(false)
    setSelectIndexValue(-1)
    refInput.current.blur()
    onDismiss && onDismiss()
  }

  function _onChangeText (t) {
    setInputValue(t)
    setSelectIndexValue(-1)
    onChangeText && onChangeText(t)
  }

  const renderItems = _data.current.map((item, index) => {
    if (renderItem) {
      return pug`
        TouchableOpacity(
          key=index
          onPress=()=> {
            onChange && onChange(item)
            onClose()
          }
        )= renderItem(item, index, selectIndexValue)
      `
    }

    return pug`
      Menu.Item.item(
        key=index
        styleName={ selectMenu: selectIndexValue === index }
        onPress=e=> {
          onChange && onChange(item)
          onClose()
        }
        active=item.value === value.value
      )= item.label
    `
  })

  return pug`
    Popover(
      visible=(isShow || isLoading)
      style=style
      hasWidthCaption=true
      durationOpen=200
      durationClose=200
      animateType='slide'
      onDismiss=onClose
      onRequestClose=()=> setInputValue('')
    )
      Popover.Caption.caption
        TextInput(
          ref=refInput
          value=(!isShow && value.label) || inputValue
          placeholder=placeholder
          onChangeText=_onChangeText
          onFocus=()=> setIsShow(true)
          onBlur=()=> Platform.OS !== 'web' && setIsShow(false)
          onKeyPress=onKeyPress
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
  style: {},
  options: [],
  value: {},
  placeholder: 'Select value',
  renderItem: null,
  isLoading: false
}

AutoSuggest.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
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
