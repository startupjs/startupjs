import React, { useState, useRef, useMemo } from 'react'
import {
  View,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import escapeRegExp from 'lodash/escapeRegExp'
import TextInput from '../forms/TextInput'
import Menu from '../Menu'
import Div from '../Div'
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

// TODO: KeyboardAvoidingView
function AutoSuggest ({
  style,
  captionStyle,
  options,
  value,
  placeholder,
  renderItem,
  isLoading,
  label,
  disabled,
  size,
  onChange, // to onSelect
  onFilter,
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

  const escapedInputValue = useMemo(() => escapeRegExp(inputValue), [inputValue])

  if (onFilter) {
    onFilter(inputValue)
  } else {
    _data.current = escapedInputValue
      ? options.filter(item => new RegExp(escapedInputValue, 'gi').test(item.label))
      : options
  }

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

  function renderContent () {
    return pug`
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

  function renderTooltipWrapper ({ children }) {
    return pug`
      View.wrapper
        TouchableWithoutFeedback(onPress=() => setIsShow(false))
          View.overlay
        = children
    `
  }

  return pug`
    Div(
      _showTooltip=(isShow || isLoading)
      renderTooltip=renderContent
      renderTooltipWrapper=renderTooltipWrapper
      tooltipProps={
        hasWidthCaption: (!style.width && !style.maxWidth),
        placements: SUPPORT_PLACEMENTS,
        durationOpen: 200,
        durationClose: 200,
        animateType: 'opacity',
        hasDefaultWrapper: false,
        contentStyle: {
          paddingLeft: 0, paddingRight: 0,
          paddingTop: 0, paddingBottom: 0
        },
        onDismiss: onClose,
        onRequestClose: ()=> setInputValue('')
      }
    )
      TextInput(
        ref=refInput
        style=captionStyle
        value=(!isShow && value.label) || inputValue
        placeholder=placeholder
        label=label
        disabled=disabled
        size=size
        onChangeText=_onChangeText
        onFocus=()=> setIsShow(true)
        onKeyPress=onKeyPress
        testID=testID
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
