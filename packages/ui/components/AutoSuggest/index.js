import React, { useState, useRef, useMemo } from 'react'
import {
  View,
  Platform,
  FlatList,
  TouchableOpacity
} from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import escapeRegExp from 'lodash/escapeRegExp'
import TextInput from '../forms/TextInput'
import Menu from '../Menu'
import Div from '../Div'
import Drawer from '../popups/Drawer'
import AnimatedSpawn from '../popups/Popover/AnimatedSpawn'
import Loader from '../Loader'
import MultiSelect from './MultiSelect'
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
  onRemove,
  onChangeText,
  onScrollEnd
}) {
  const _data = useRef([])
  const refInput = useRef()
  const refCaption = useRef()

  const [isShow, setIsShow] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [wrapperHeight, setWrapperHeight] = useState(null)
  const [scrollHeightContent, setScrollHeightContent] = useState(null)
  const [selectIndexValue, setSelectIndexValue, onKeyPress] = useKeyboard({
    _data,
    value,
    onSelect: _onSelect
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

    multiselect
      ? refInput.current.blur()
      : refCaption.current.blur()
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

      setInputValue('')
      setSelectIndexValue(-1)
      onChange && onChange([...value]) // DEPRECATED
      onSelect && onSelect([...value])
      Platform.OS === 'web' && refInput.current.focus()
    } else {
      onChange && onChange(item) // DEPRECATED
      onSelect && onSelect(item)
      onClose()
    }
  }

  function isActiveItem (item) {
    return multiselect
      ? value.find(iter => iter.value === item.value)
      : item.value === value.value
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
        active=isActiveItem(item)
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

  function renderWrapper (children) {
    console.log('123')
    return children
  }

  const content = pug`
    if isLoading
      View.loader
        Loader(size='s')
    else
      FlatList(
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

  return pug`
    if multiselect
      Div.multiselect(ref=refCaption)
        MultiSelect(
          ref=refInput
          value=value
          isShow=isShow
          placeholder=placeholder
          inputValue=inputValue
          renderTag=renderTag
          onKeyPress=onKeyPress
          onChangeShow=v=> setIsShow(v)
          onChangeText=_onChangeText
          onChange=onChange
        )
    else
      TextInput(
        ref=refCaption
        inputStyle=inputStyle
        value=(!isShow && value.label) || inputValue
        placeholder=placeholder
        label=label
        disabled=disabled
        size=size
        testID=testID
        onChangeText=_onChangeText
        onFocus=()=> setIsShow(true)
        onBlur=()=> setIsShow(false)
        onKeyPress=onKeyPress
      )

    if multiselect && Platform.OS !== 'web'
      Drawer(
        visible=(isShow || isLoading)
        position='bottom'
        style={ height: 200 }
        onDismiss=()=> setIsShow(false)
      )= content
    else
      AnimatedSpawn.content(
        visible=(isShow || isLoading)
        refCaption=refCaption
        hasWidthCaption=(!style.width && !style.maxWidth)
        placements=SUPPORT_PLACEMENTS
        durationOpen=200
        durationClose=200
        animateType='opacity'
        renderWrapper=renderWrapper
        onRequestClose=()=> setIsShow(false)
      )
        Div(nativeID='popoverContent')= content
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
  contentStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  inputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
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

export default observer(themed(AutoSuggest))
