import React from 'react'
import { Div, Span, Checkbox, Popover } from '@startupjs/ui'
import PropTypes from 'prop-types'
import MultiselectInput from './input'
import { u, observer } from 'startupjs'
import './index.styl'

const Multiselect = ({
  options,
  value,
  onSelect,
  onRemove,
  placeholder,
  label,
  showOptsMenu,
  hideOptsMenu,
  showOpts,
  tagVariant,
  activeColor,
  disabled,
  readOnly,
  popoverWidth,
  error
}) => {
  function renderOpt (opt) {
    const selected = value.some(_value => _value === opt.value)
    const selectCb = () => {
      if (selected) {
        onRemove(opt.value)
      } else {
        onSelect(opt.value)
      }
    }
    return pug`
      Div.suggestion(key=opt.value onPress=selectCb)
        Checkbox.checkbox(value=selected onChange=selectCb)
        Span.sugText= opt.label
    `
  }
  return pug`
    Popover.root(
      visible=showOpts
      onDismiss=hideOptsMenu
      width=popoverWidth
      styleWrapper={ height: 'auto', maxHeight: u(20) }
    )
      Popover.Caption
        MultiselectInput(
          label=label
          showOptsMenu=showOptsMenu
          showOpts=showOpts
          value=value
          placeholder=placeholder
          options=options
          tagVariant=tagVariant
          activeColor=activeColor
          disabled=disabled
          error=error
          readOnly=readOnly
        )
      Div.suggestions-web
        each opt in options
          =renderOpt(opt)
  `
}

Multiselect.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.array.isRequired,
  onSelect: PropTypes.func,
  onRemove: PropTypes.func,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  showOptsMenu: PropTypes.func.isRequired,
  hideOptsMenu: PropTypes.func.isRequired,
  showOpts: PropTypes.bool.isRequired,
  tagVariant: PropTypes.string,
  activeColor: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  popoverWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  error: PropTypes.string
}

export default observer(Multiselect)
