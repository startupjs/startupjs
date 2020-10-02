import React from 'react'
import { Div, Row, Span, Tag } from '@startupjs/ui'
import styles from './index.styl'
import PropTypes from 'prop-types'

function MultiselectInput ({
  label,
  showOptsMenu,
  value,
  placeholder,
  options,
  tagVariant,
  activeColor,
  disabled
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
          size='s'
          variant='description'
        )= label
      Row.input(
        styleName={ disabled }
        onPress=disabled ? void 0 : showOptsMenu
      )
        if !value || !value.length
          Span.placeholder= placeholder
        each _value, index in value
          =renderTag(_value, index)
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
  disabled: PropTypes.bool
}

export default MultiselectInput