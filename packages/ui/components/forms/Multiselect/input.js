import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from './../../Div'
import Span from './../../typography/Span'
import DefaultInput from './defaultInput'
import DefaultTag from './defaultTag'
import './index.styl'

function MultiselectInput ({
  label,
  value,
  placeholder,
  options,
  disabled,
  readonly,
  focused,
  tagLimit,
  error,
  TagComponent,
  InputComponent,
  onOpen
}) {
  const _values = tagLimit ? value.slice(0, tagLimit) : value
  const hiddenTagsLength = tagLimit
    ? value.slice(tagLimit, value.length).length
    : 0

  const Input = InputComponent || DefaultInput

  return pug`
    Div.inputRoot
      if label
        Span.label(
          styleName={ focused, error }
          description
        )= label
      Input(
        value=_values
        placeholder=placeholder
        disabled=disabled
        focused=focused
        error=error
        readonly=readonly
        onOpen=onOpen
      )
        each _value, index in _values
          - const record = options.find(r => r.value === _value)
          - const isLast = index + 1 === _values.length
          TagComponent(
            key=record.value
            index=index
            isLast=isLast
            record=record
          )
        if hiddenTagsLength
          Span.ellipsis ...
          DefaultTag(
            index=0
            record={ label: '+' + hiddenTagsLength }
          )
      if error && !readonly
        Span.error(description)= error
  `
}

MultiselectInput.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.array.isRequired,
  onOpen: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  tagLimit: PropTypes.number,
  focused: PropTypes.bool,
  error: PropTypes.string,
  TagComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  InputComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
}

export default observer(MultiselectInput)
