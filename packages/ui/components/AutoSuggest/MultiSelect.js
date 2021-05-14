import React from 'react'
import { TextInput } from 'react-native'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Row from '../Row'
import Div from '../Div'
import Span from '../typography/Span'
import Icon from '../Icon'
import './index.styl'

export default React.forwardRef(function MultiSelect ({
  value,
  inputValue,
  placeholder,
  renderTag,
  renderInput,
  onChange,
  onChangeShow,
  onChangeText
}, ref) {
  function onShow () {
    onChangeShow(true)
    ref.current.focus()
  }

  function onRemoveTag (tag) {
    const index = value.findIndex(item => item.value === tag.value)
    value.splice(index, 1)
    onChange([...value])
  }

  // renderTag
  return pug`
    Row.tagList(onPress=onShow)
      // Span= placeholder
      each item in value
        Row.tag(key=item.value)
          Span= item.label
          Div(onPress=()=> onRemoveTag(item))
            Icon.tagIcon(icon=faTimes)
      Div.multiselectInputCase(style={
        width: inputValue.length * 10,
        marginLeft: value.length ? 5 : 8
      })
        TextInput.multiselectInput(
          ref=ref
          value=inputValue
          onChangeText=v=> onChangeText(v)
        )
  `
})
