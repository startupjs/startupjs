import React, { useState } from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Checkbox from './../Checkbox'
import MultiselectComponent from './multiselect'
import DefaultTag from './defaultTag'
import './index.styl'

const Multiselect = ({
  options,
  value,
  placeholder,
  label,
  disabled,
  readonly,
  tagLimit,
  error,
  TagComponent,
  hasWidthCaption,
  onChange,
  onSelect,
  onRemove,
  onFocus,
  onBlur
}) => {
  const [focused, setFocused] = useState(false)
  // Map array if user pass options pass an array of primitives
  // Convert it into { label, value } items for consistency
  const _options = options.map(opt => typeof opt === 'object' && opt !== null ? opt : { label: opt, value: opt })

  function _onRemove (_value) {
    onRemove && onRemove(_value)
    onChange && onChange(value.filter(v => v !== _value))
  }

  function _onSelect (_value) {
    onSelect && onSelect(_value)
    onChange && onChange([...value, _value])
  }

  function _onFocus () {
    setFocused(true)
    onFocus && onFocus()
  }

  function _onBlur () {
    setFocused(false)
    onBlur && onBlur()
  }

  function onHide () {
    _onBlur(false)
  }

  const onItemPress = value => checked => {
    if (!checked) {
      _onRemove(value)
    } else {
      _onSelect(value)
    }
  }

  function renderListItem (item) {
    const selected = value.includes(item.value)

    return pug`
      Checkbox.checkbox(key=item.value label=item.label value=selected onChange=onItemPress(item.value))
    `
  }

  return pug`
    MultiselectComponent(
      options=_options
      value=value
      placeholder=placeholder
      label=label
      focused=focused
      disabled=disabled
      tagLimit=tagLimit
      readonly=readonly
      error=error
      TagComponent=TagComponent
      hasWidthCaption=hasWidthCaption
      renderListItem=renderListItem
      onOpen=_onFocus
      onHide=onHide
    )
  `
}

Multiselect.propTypes = {
  value: PropTypes.array.isRequired,
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  tagLimit: PropTypes.number,
  error: PropTypes.string,
  TagComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  hasWidthCaption: PropTypes.bool,
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  onRemove: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
}

Multiselect.defaultProps = {
  value: [],
  options: [],
  placeholder: 'Select',
  disabled: false,
  readonly: false,
  hasWidthCaption: false,
  TagComponent: DefaultTag
}

export default observer(Multiselect)
