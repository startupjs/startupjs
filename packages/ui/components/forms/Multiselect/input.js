import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Span from './../../typography/Span'
import DefaultInput from './defaultInput'
import DefaultTag from './defaultTag'
import './index.styl'

function MultiselectInput ({
  label,
  description,
  layout,
  value,
  placeholder,
  options,
  disabled,
  readonly,
  focused,
  tagLimit,
  TagComponent,
  InputComponent,
  onOpen
}) {
  const values = tagLimit ? value.slice(0, tagLimit) : value
  const hiddenTagsLength = tagLimit
    ? value.slice(tagLimit, value.length).length
    : 0

  const Input = InputComponent || DefaultInput

  return pug`
    Input(
      value=values
      label=label
      description=description
      layout=layout
      placeholder=placeholder
      disabled=disabled
      focused=focused
      readonly=readonly
      onOpen=onOpen
    )
      each value, index in values
        - const record = options.find(r => r.value === value)
        - const isLast = index + 1 === values.length
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
  `
}

MultiselectInput.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.array.isRequired,
  onOpen: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  description: PropTypes.string,
  layout: PropTypes.string,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  tagLimit: PropTypes.number,
  focused: PropTypes.bool,
  TagComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  InputComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
}

export default observer(MultiselectInput)
