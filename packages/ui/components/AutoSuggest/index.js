import React, { useState, useRef, useMemo } from 'react'
import { Platform, TouchableOpacity } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import escapeRegExp from 'lodash/escapeRegExp'
import Menu from '../Menu'
import Caption from './Caption'
import Content from './Content'
import useKeyboard from './useKeyboard'
import themed from '../../theming/themed'
import './index.styl'

function AutoSuggest ({
  style,
  contentStyle,
  options,
  value,
  multiselect,
  placeholder,
  renderItem,
  renderTag,
  renderInput,
  isLoading,
  label,
  description,
  disabled,
  size,
  testID,
  limitTagSelect,
  onChange, // DEPRECATED
  onSelect,
  onFilter,
  onDismiss,
  onChangeText,
  onScrollEnd
}) {
  const _data = useRef([])
  const refCaption = useRef()

  const [isShow, setIsShow] = useState(false)
  const [inputValue, setInputValue] = useState('')
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

    refCaption.current.blur()
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
      Platform.OS === 'web' && refCaption.current.focus()
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

  return pug`
    Caption(
      ref=refCaption
      multiselect=multiselect
      style=style
      value=value
      isShow=isShow
      inputValue=inputValue
      placeholder=placeholder
      label=label
      description=description
      disabled=disabled
      size=size
      testID=testID
      renderTag=renderTag
      onKeyPress=onKeyPress
      onSelect=_onSelect
      onChange=onChange
      onChangeText=_onChangeText
      onChangeShow=v=> setIsShow(v)
    )
    Content(
      refCaption=refCaption
      style=style
      multiselect=multiselect
      data=_data.current
      value=value
      isShow=isShow
      isLoading=isLoading
      renderItem=_renderItem
      onChange=onChange
      onChangeShow=v=> setIsShow(v)
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
