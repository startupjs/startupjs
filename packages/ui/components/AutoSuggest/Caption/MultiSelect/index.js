import React, { useRef, useEffect } from 'react'
import { Platform, TextInput } from 'react-native'
import { observer } from 'startupjs'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Row from '../../../Row'
import Div from '../../../Div'
import Span from '../../../typography/Span'
import Icon from '../../../Icon'
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
  const refInput = useRef()

  useEffect(() => {
    ref.current.blur = () => refInput.current.blur()
    ref.current.focus = () => refInput.current.focus()
  }, [])

  function onHide (e) {
    if (e.target.closest('#popoverContent')) return

    if (!e.target.closest('#tagList')) {
      e.preventDefault()
      e.stopPropagation()
      onChangeShow(false)
      window.removeEventListener('click', onHide, true)
    }
  }

  function onShow () {
    onChangeShow(true)

    if (Platform.OS === 'web') {
      window.addEventListener('click', onHide, true)
      ref.current.focus()
    }
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
    Div.multiselect(ref=ref)
      Row.tagList(
        nativeID='tagList'
        onPress=onShow
      )
        if !inputValue && !value.length
          Span.placeholder= placeholder
        each item, index in value
          = _renderTag(item, index)
        Div.inputCase(style={
          width: inputValue.length * 10,
          marginLeft: value.length ? 5 : 8
        })
          if Platform.OS === 'web'
            TextInput.input(
              ref=refInput
              value=inputValue
              onKeyPress=_onKeyPress
              onChangeText=v=> onChangeText(v)
            )
  `
}

export default observer(MultiSelect, { forwardRef: true })
