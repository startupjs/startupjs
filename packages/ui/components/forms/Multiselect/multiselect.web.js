import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Popover from './../../popups/Popover'
import MultiselectInput from './input'
import './index.styl'

const Multiselect = ({
  options,
  value,
  placeholder,
  label,
  focused,
  disabled,
  readonly,
  tagLimit,
  error,
  TagComponent,
  renderListItem,
  hasWidthCaption,
  onSelect,
  onRemove,
  onOpen,
  onHide
}) => {
  return pug`
    Popover.popover(
      visible=focused
      attachment='start'
      position='bottom'
      hasWidthCaption=hasWidthCaption
      onDismiss=onHide
    )
      Popover.Caption
        MultiselectInput(
          label=label
          showOpts=focused
          value=value
          placeholder=placeholder
          tagLimit=tagLimit
          options=options
          disabled=disabled
          error=error
          readonly=readonly
          TagComponent=TagComponent
          onOpen=onOpen
        )
      each opt in options
        = renderListItem(opt)
  `
}

Multiselect.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.array.isRequired,
  onSelect: PropTypes.func,
  onRemove: PropTypes.func,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  onOpen: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  focused: PropTypes.bool.isRequired,
  tagLimit: PropTypes.number,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  error: PropTypes.string,
  TagComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  renderListItem: PropTypes.func
}

export default observer(Multiselect)
