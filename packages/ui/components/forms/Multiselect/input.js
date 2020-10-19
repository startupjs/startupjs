import React from 'react'
import { Div, Row, Span, Tag } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { observer } from 'startupjs'
import './index.styl'

function MultiselectInput ({
  label,
  showOptsMenu,
  value,
  placeholder,
  options,
  tagVariant,
  activeColor,
  disabled,
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
        styleName={ disabled, focused: showOpts, error }
        onPress=disabled ? void 0 : showOptsMenu
      )
        if !value || !value.length
          Span.placeholder= placeholder
        each _value, index in value
          =renderTag(_value, index)
      if error
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
  showOpts: PropTypes.bool,
  error: PropTypes.string
}

export default observer(MultiselectInput)
