import React, { useState, useRef, useEffect, useMemo } from 'react'
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  FlatList
} from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import escapeRegExp from 'lodash/escapeRegExp'
import { stringifyValue, getLabelFromValue } from './../forms/Radio/helpers'
import TextInput from '../forms/TextInput'
import Menu from '../Menu'
import AbstractPopover from '../AbstractPopover'
import Loader from '../Loader'
import useKeyboard from './useKeyboard'
import themed from '../../theming/themed'
import './index.styl'

const SUPPORT_PLACEMENTS = [
  'bottom-start',
  'bottom-center',
  'bottom-end',
  'top-start',
  'top-center',
  'top-end'
]

// TODO: KeyboardAvoidingView
function AutoSuggest ({
  style,
  captionStyle,
  inputStyle,
  iconStyle,
  inputIcon,
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
  const inputRef = useRef()
  const [_options, setOptions] = useState(options)
  const [isShow, setIsShow] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [wrapperHeight, setWrapperHeight] = useState(null)
  const [scrollHeightContent, setScrollHeightContent] = useState(null)
  const [selectIndexValue, setSelectIndexValue, onKeyPress] = useKeyboard({
    isShow,
    options: _options,
    value,
    onChange,
    onChangeShow: v => setIsShow(v)
  })

  const escapedInputValue = useMemo(() => escapeRegExp(inputValue), [inputValue])

  _data.current = escapedInputValue
    ? options.filter(item => new RegExp(escapedInputValue, 'gi').test(item.label))
    : options

  const label = useMemo(() => {
    return getLabelFromValue(value, options)
  }, [value])

  useEffect(() => {
    setInputValue(label)
  }, [label])

  function onClose () {
    setIsShow(false)
    setSelectIndexValue(-1)
    inputRef.current.blur()
    onDismiss && onDismiss()
  }

  function _onChangeText (text) {
    setInputValue(text)
    if (!text) onChange()
    setSelectIndexValue(-1)
    onChangeText && onChangeText(text)

    const escapedText = escapeRegExp(text)
    const newOptions = options
      .filter(option => {
        return new RegExp(escapedText, 'gi')
          .test(getLabelFromValue(option, options))
      })

    setOptions(newOptions)
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
        active=stringifyValue(item) === stringifyValue(value)
      )= getLabelFromValue(item, options)
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

  function renderWrapper (children) {
    return pug`
      View.root
        TouchableWithoutFeedback(onPress=() => {
          if (value) setInputValue(getLabelFromValue(value, options))
          onClose()
        })
          View.overlay
        = children
    `
  }

  return pug`
    TextInput(
      ref=inputRef
      style=captionStyle
      inputStyle=inputStyle
      iconStyle=iconStyle
      icon=inputIcon
      value=inputValue
      placeholder=placeholder
      onChangeText=_onChangeText
      onFocus=() => setIsShow(true)
      onKeyPress=onKeyPress
      testID=testID
    )

    AbstractPopover(
      visible=(isShow || isLoading)
      anchorRef=inputRef
      matchAnchorWidth=(!style.width && !style.maxWidth)
      placements=SUPPORT_PLACEMENTS
      durationOpen=200
      durationClose=200
      onCloseComplete=() => setOptions(options)
      renderWrapper=renderWrapper
    )
      if isLoading
        View.loaderCase
          Loader(size='s')
      else
        View.contentCase
          FlatList.content(
            style=style
            data=_options
            renderItem=_renderItem
            keyExtractor=item => stringifyValue(item)
            scrollEventThrottle=500
            keyboardShouldPersistTaps="always"
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

export default observer(themed('AutoSuggest', AutoSuggest))
