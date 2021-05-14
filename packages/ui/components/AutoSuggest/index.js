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
import MultiSelect from './MultiSelect'
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
  contentStyle,
  inputStyle,
  options,
  value, // string or array
  multiselect,
  placeholder,
  renderItem,
  renderTag,
  renderInput,
  isLoading,
  label,
  disabled,
  size,
  testID,
  limitTagSelect,
  onChange, // DEPRECATED
  onSelect,
  onFilter,
  onDismiss,
  onChangeText,
  onScrollEnd,
  onRemove
}) {
  const _data = useRef([])
  const refInput = useRef()

  const [isShow, setIsShow] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [wrapperHeight, setWrapperHeight] = useState(null)
  const [_inputStyle] = useState(inputStyle || {})
  const [scrollHeightContent, setScrollHeightContent] = useState(null)
  const [selectIndexValue, setSelectIndexValue, onKeyPress] = useKeyboard({
    isShow,
    _data,
    value,
    onChange, // DEPRECATED
    onSelect,
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
    multiselect && setInputValue('')
    setSelectIndexValue(-1)
    refInput.current.blur()
    onDismiss && onDismiss()
  }

  function _onChangeText (t) {
    setInputValue(t)
    setSelectIndexValue(-1)
    onChangeText && onChangeText(t)
  }

  function _onSelect (item) {
    if (multiselect) {
      const index = value.findIndex(i => i.value === item.value)
      if (index !== -1) value.splice(index, 1)
      else value.push(item)

      onChange && onChange([...value]) // DEPRECATED
      onSelect && onSelect([...value])
      refInput.current.focus()
    } else {
      onChange && onChange(item) // DEPRECATED
      onSelect && onSelect(item)
      onClose()
    }
  }

  function _renderItem ({ item, index }) {
    if (renderItem) {
      return pug`
        TouchableOpacity(
          key=index
          onPress=()=> _onSelect(item)
        )= renderItem(item, index, selectIndexValue)
      `
    }

    return pug`
      Menu.Item.item(
        key=index
        styleName={ selectMenu: selectIndexValue === index }
        onPress=()=> _onSelect(item)
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
            style=contentStyle
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
        onDismiss: onClose
      }
      styleName={ multiselect }
    )
      if multiselect
        MultiSelect(
          ref=refInput
          value=value
          placeholder=placeholder
          inputValue=inputValue
          renderTag=renderTag
          onChangeShow=v=> setIsShow(v)
          onChangeText=_onChangeText
          onChange=onChange
        )
      else
        TextInput(
          ref=refInput
          inputStyle=_inputStyle
          value=(!isShow && value.label) || inputValue
          placeholder=placeholder
          label=label
          disabled=disabled
          size=size
          testID=testID
          onChangeText=_onChangeText
          onFocus=()=> setIsShow(true)
          onKeyPress=onKeyPress
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
  value: PropTypes.any,
  placeholder: PropTypes.string,
  renderItem: PropTypes.func,
  isLoading: PropTypes.bool,
  onChange: PropTypes.func,
  onDismiss: PropTypes.func,
  onChangeText: PropTypes.func,
  onScrollEnd: PropTypes.func
}

export default observer(AutoSuggest)
