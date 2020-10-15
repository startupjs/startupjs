import React from 'react'
import { Div, Row, Span, Tag } from '@startupjs/ui'
import './index.styl'
import PropTypes from 'prop-types'
import { observer } from 'startupjs'

function MultiselectInput ({
  label,
  showOptsMenu,
  value,
  placeholder,
  options,
  tagVariant,
  activeColor,
  disabled,
  readOnly,
  showOpts,
  error
}) {
  function renderTag (_value, index) {
    const record = options.find(r => r.value === _value)
    return pug`
      Tag(
        key=_value
        pushed=index !== 0
        variant=tagVariant
        color=activeColor
      )= record.label
    `
  }

  return pug`
    Div.inputRoot
      if label
        Span.label(
          styleName={ focused: showOpts, error }
          size='s'
          variant='description'
        )= label
      Row.input(
        styleName={ disabled, focused: showOpts, error, readOnly }
        onPress=disabled || readOnly ? void 0 : showOptsMenu
      )
        if !value || !value.length && !readOnly
          Span.placeholder= placeholder
        if !value || !value.length && readOnly
          Span.placeholder='-'
        each _value, index in value
          =renderTag(_value, index)
      if error && !readOnly
        Span.error(
          size='s'
          variant='description'
        )= error
  `
}

MultiselectInput.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.array.isRequired,
  showOptsMenu: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  tagVariant: PropTypes.string,
  activeColor: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  showOpts: PropTypes.bool,
  error: PropTypes.string
}

export default observer(MultiselectInput)
