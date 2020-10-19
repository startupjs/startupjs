import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import { Div, Row, Span } from '@startupjs/ui'
import './index.styl'

function MultiselectInput ({
  label,
  showOptsMenu,
  value,
  placeholder,
  options,
  disabled,
  readonly,
  showOpts,
  error,
  TagComponent
}) {
  function renderTag (_value, index) {
    const record = options.find(r => r.value === _value)

    return pug`
      TagComponent(
        key=record.value
        index=index
        record=record
      )
    `
  }

  return pug`
    Div.inputRoot
      if label
        Span.label(
          styleName={ focused: showOpts, error }
          variant='description'
        )= label
      Row.input(
        styleName={ disabled, focused: showOpts, error, readonly }
        onPress=disabled || readonly ? void 0 : showOptsMenu
      )
        if !value || !value.length && !readonly
          Span.placeholder= placeholder
        if !value || !value.length && readonly
          Span.placeholder='-'
        each _value, index in value
          = renderTag(_value, index)
      if error && !readonly
        Span.error(variant='description')= error
  `
}

MultiselectInput.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.array.isRequired,
  showOptsMenu: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  showOpts: PropTypes.bool,
  error: PropTypes.string,
  TagComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
}

export default observer(MultiselectInput)
