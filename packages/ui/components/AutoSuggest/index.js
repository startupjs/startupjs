import React, { useState, useRef, useEffect, useMemo } from 'react'
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  FlatList
} from 'react-native'
import { observer } from 'startupjs'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import escapeRegExp from 'lodash/escapeRegExp'
import { parseValue, stringifyValue, getLabelFromValue } from './../forms/Radio/helpers'
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
  disabled,
  readonly,
  onChange,
  onDismiss,
  onChangeText,
  onScrollEnd,
  testID
}) {
  const inputRef = useRef()
  const [isShow, setIsShow] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [wrapperHeight, setWrapperHeight] = useState(null)
  const [scrollHeightContent, setScrollHeightContent] = useState(null)
  const [textToFilter, setTextToFilter] = useState()
  const _options = useMemo(() => {
    const escapedText = escapeRegExp(textToFilter)
    return options.filter(option => {
      return new RegExp(escapedText, 'gi')
        .test(getLabelFromValue(option, options))
    })
  }, [options, textToFilter])

  const [selectIndexValue, setSelectIndexValue, onKeyPress] = useKeyboard({
    options: _options,
    onChange,
    onChangeShow: v => setIsShow(v)
  })

  const selectedLabel = useMemo(() => {
    return getLabelFromValue(value, options)
  }, [value])

  useEffect(() => {
    setInputValue(selectedLabel)
  }, [selectedLabel])

  function onClose () {
    setIsShow(false)
    setSelectIndexValue(-1)
    inputRef.current.blur()
    onDismiss && onDismiss()
  }

  function _onChangeText (text) {
    setInputValue(text)
    setTextToFilter(text)
    if (!text) onChange()
    setSelectIndexValue(-1)
    onChangeText && onChangeText(text)
  }

  async function _onPress (item) {
    onChange && await onChange(parseValue(stringifyValue(item)))
    onClose()
  }

  function _renderItem ({ item, index }) {
    if (renderItem) {
      return pug`
        TouchableOpacity(
          key=index
          onPress=() => _onPress(item)
        )= renderItem(item, index, selectIndexValue)
      `
    }

    return pug`
      Menu.Item.item(
        key=index
        styleName={ selectMenu: selectIndexValue === index }
        onPress=() => _onPress(item)
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
          setInputValue(selectedLabel)
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
      icon=value && !disabled ? faTimes : undefined
      iconPosition='right'
      value=inputValue
      placeholder=placeholder
      disabled=disabled
      readonly=readonly
      onChangeText=_onChangeText
      onFocus=() => setIsShow(true)
      onKeyPress=onKeyPress
      onIconPress=() => onChange()
      testID=testID
    )

    AbstractPopover(
      visible=(isShow || isLoading)
      anchorRef=inputRef
      matchAnchorWidth=(!style.width && !style.maxWidth)
      placements=SUPPORT_PLACEMENTS
      durationOpen=200
      durationClose=200
      renderWrapper=renderWrapper
      onCloseComplete=() => setTextToFilter()
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
  placeholder: 'Select value',
  isLoading: false
}

AutoSuggest.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  captionStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  value: PropTypes.any,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.shape({
        value: PropTypes.any,
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      })
    ])
  ),
  placeholder: PropTypes.string,
  renderItem: PropTypes.func,
  isLoading: PropTypes.bool,
  onChange: PropTypes.func,
  onDismiss: PropTypes.func,
  onChangeText: PropTypes.func,
  onScrollEnd: PropTypes.func
}

export default observer(themed('AutoSuggest', AutoSuggest))
