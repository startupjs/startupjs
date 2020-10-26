import React, { useState } from 'react'
import { observer, u } from 'startupjs'
import PropTypes from 'prop-types'
import MultiselectComponent from './multiselect'
import DefaultTag from './defaultTag'
import { Checkbox } from '@startupjs/ui'

import './index.styl'

const Multiselect = ({
  options,
  value,
  placeholder,
  label,
  disabled,
  popoverWidth,
  readonly,
  error,
  TagComponent,
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

  function hideOptsMenu () {
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
      readonly=readonly
      popoverWidth=popoverWidth
      error=error
      TagComponent=TagComponent
      renderListItem=renderListItem
      onOpen=_onFocus
      onHide=hideOptsMenu
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
  popoverWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  error: PropTypes.string,
  TagComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
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
  popoverWidth: u(30),
  TagComponent: DefaultTag
}

export default observer(Multiselect)
