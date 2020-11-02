import React from 'react'
import { observer } from 'startupjs'
import { Div, Row, Span } from '@startupjs/ui'
import PropTypes from 'prop-types'
import './index.styl'

function MultiselectInput ({
  label,
  value,
  placeholder,
  options,
  disabled,
  readonly,
  focused,
  error,
  TagComponent,
  onOpen
}) {
  return pug`
    Div.inputRoot
      if label
        Span.label(
          styleName={ focused, error }
          variant='description'
        )= label
      Row.input(
        styleName={ disabled, focused, error, readonly }
        onPress=disabled || readonly ? void 0 : onOpen
      )
        if !value || !value.length && !readonly
          Span.placeholder= placeholder
        if !value || !value.length && readonly
          Span.placeholder='-'
        each _value, index in value
          - const record = options.find(r => r.value === _value)
          TagComponent(
            key=record.value
            index=index
            record=record
          )
      if error && !readonly
        Span.error(variant='description')= error
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
  focused: PropTypes.bool,
  error: PropTypes.string,
  TagComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
}

export default observer(MultiselectInput)
