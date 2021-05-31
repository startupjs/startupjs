import React from 'react'
import { Platform, TextInput } from 'react-native'
import { observer } from 'startupjs'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Row from '../Row'
import Div from '../Div'
import Span from '../typography/Span'
import Icon from '../Icon'
import './index.styl'

function MultiSelect ({
  value,
  inputValue,
  placeholder,
  renderTag,
  renderInput,
  onKeyPress,
  onChange,
  onChangeShow,
  onChangeText
}, ref) {
  function onHide (e) {
    if (Platform.OS === 'web') {
      if (e.target.closest('#popoverContent')) return

      if (!e.target.closest('#tagList')) {
        e.preventDefault()
        e.stopPropagation()
        onChangeShow(false)
        window.removeEventListener('click', onHide, true)
      }
    } else {
      onChangeShow(false)
    }
  }

  function onShow () {
    onChangeShow(true)
    Platform.OS === 'web' && window.addEventListener('click', onHide, true)
    ref.current.focus()
  }

  function onRemoveTag (tag) {
    const index = value.findIndex(item => item.value === tag.value)
    value.splice(index, 1)
    onChange([...value])
  }

  function _onKeyPress (e) {
    onKeyPress(e)

    const keyName = e.key
    if (keyName === 'Backspace' && inputValue.length === 0) {
      value.pop()
      onChange([...value])
    }
  }

  function _renderTag (item, index) {
    if (renderTag) {
      return renderTag(item, index, { onRemoveTag })
    }

    return pug`
      Row.tag(key=item.value)
        Span= item.label
        Div(onPress=()=> onRemoveTag(item))
          Icon.tagIcon(icon=faTimes)
    `
  }

  return pug`
    Row.tagList(
      nativeID='tagList'
      onPress=onShow
    )
      if !inputValue && !value.length
        Span.placeholder= placeholder
      each item, index in value
        = _renderTag(item, index)
      Div.multiselectInputCase(style={
        width: inputValue.length * 10,
        marginLeft: value.length ? 5 : 8
      })
        TextInput.multiselectInput(
          ref=ref
          value=inputValue
          onKeyPress=_onKeyPress
          onChangeText=v=> onChangeText(v)
        )
  `
}

export default observer(MultiSelect, { forwardRef: true })
