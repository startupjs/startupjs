import React from 'react'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import Span from './../../typography/Span'
import DefaultInput from './defaultInput'
import DefaultTag from './defaultTag'
import themed from '../../../theming/themed'
import './index.styl'

function MultiselectInput ({
  value,
  placeholder,
  options,
  disabled,
  readonly,
  focused,
  tagLimit,
  TagComponent,
  InputComponent,
  onOpen,
  onHide,
  _hasError
}, ref) {
  const values = tagLimit ? value.slice(0, tagLimit) : value
  const hiddenTagsLength = tagLimit
    ? value.slice(tagLimit, value.length).length
    : 0

  InputComponent ??= DefaultInput

  return pug`
    InputComponent(
      ref=ref
      part='root'
      value=values
      placeholder=placeholder
      disabled=disabled
      focused=focused
      readonly=readonly
      onOpen=onOpen
      onHide=onHide
      _hasError=_hasError
    )
      each value, index in values
        - const record = options.find(r => r.value === value) || {}
        - const isLast = index + 1 === values.length
        TagComponent(
          key=value
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
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  options: PropTypes.array.isRequired,
  value: PropTypes.array.isRequired,
  onOpen: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  tagLimit: PropTypes.number,
  focused: PropTypes.bool,
  TagComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  InputComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  _hasError: PropTypes.bool // @private
}

export default observer(
  themed('Multiselect', MultiselectInput),
  { forwardRef: true }
)
