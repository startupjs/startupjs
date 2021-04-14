import React, { useState, useRef } from 'react'
import { TouchableOpacity, View, FlatList } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import TextInput from '../forms/TextInput'
import Menu from '../Menu'
import Popover from '../popups/Popover'
import Loader from '../Loader'
import useKeyboard from './useKeyboard'
import './index.styl'

const SUPPORT_PLACEMENTS = [
  'bottom-start',
  'bottom-center',
  'bottom-end',
  'top-start',
  'top-center',
  'top-end'
]

const reRegExpChar = /[\\^$.*+?()[\]{}|]/g

// TODO: KeyboardAvoidingView
function AutoSuggest ({
  style,
  captionStyle,
  options,
  value,
  placeholder,
  renderItem,
  isLoading,
  onChange,
  onDismiss,
  onChangeText,
  onScrollEnd,
  testID
}) {
  const _data = useRef([])
  const refInput = useRef()

  const [isShow, setIsShow] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [wrapperHeight, setWrapperHeight] = useState(null)
  const [scrollHeightContent, setScrollHeightContent] = useState(null)
  const [selectIndexValue, setSelectIndexValue, onKeyPress] = useKeyboard({
    isShow,
    _data,
    value,
    onChange,
    onChangeShow: v => setIsShow(v)
  })

  _data.current = options.filter(item => {
    if (inputValue) {
      const replaced = reRegExpChar.test(inputValue)
        ? inputValue.replace(reRegExpChar, '\\$&')
        : inputValue
      return new RegExp(replaced, 'gi').test(item.label)
    }
    return true
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

  function _renderItem ({ item, index }) {
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
  }

  function onScroll ({ nativeEvent }) {
    if (nativeEvent.contentOffset.y + wrapperHeight === scrollHeightContent) {
      onScrollEnd && onScrollEnd()
    }
  }

  function onLayoutWrapper ({ nativeEvent }) {
    setWrapperHeight(nativeEvent.layout.height)
  }

  function onChangeSizeScroll (width, height) {
    setScrollHeightContent(height)
  }

  return pug`
    Popover(
      visible=(isShow || isLoading)
      hasWidthCaption=(!style.width && !style.maxWidth)
      placements=SUPPORT_PLACEMENTS
      durationOpen=200
      durationClose=200
      animateType='slide'
      hasDefaultWrapper=false
      onDismiss=onClose
      onRequestClose=()=> setInputValue('')
    )
      Popover.Caption.caption
        TextInput(
          ref=refInput
          style=captionStyle
          value=(!isShow && value.label) || inputValue
          placeholder=placeholder
          onChangeText=_onChangeText
          onFocus=()=> setIsShow(true)
          onKeyPress=onKeyPress
          testID=testID
        )

      if isLoading
        View.loaderCase
          Loader(size='s')
      else
        View.contentCase
          FlatList.content(
            style=style
            data=_data.current
            extraData=_data.current
            renderItem=_renderItem
            keyExtractor=item=> item.value
            scrollEventThrottle=500
            onScroll=onScroll
            onLayout=onLayoutWrapper
            onContentSizeChange=onChangeSizeScroll
          )
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
  captionStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
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
