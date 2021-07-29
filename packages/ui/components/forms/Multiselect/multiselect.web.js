import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Popover from './../../popups/Popover'
import MultiselectInput from './input'
import themed from '../../../theming/themed'
import './index.styl'

const Multiselect = ({
  style,
  inputStyle,
  options,
  value,
  placeholder,
  focused,
  disabled,
  readonly,
  tagLimit,
  InputComponent,
  TagComponent,
  renderListItem,
  hasWidthCaption,
  onSelect,
  onRemove,
  onOpen,
  onHide,
  _hasError
}) => {
  return pug`
    Popover.popover(
      captionStyle=style
      visible=focused
      attachment='start'
      position='bottom'
      hasWidthCaption=hasWidthCaption
      onDismiss=onHide
    )
      Popover.Caption
        MultiselectInput(
          style=inputStyle
          focused=focused
          value=value
          placeholder=placeholder
          tagLimit=tagLimit
          options=options
          disabled=disabled
          readonly=readonly
          InputComponent=InputComponent
          TagComponent=TagComponent
          onOpen=onOpen
          _hasError=_hasError
        )
      each opt in options
        = renderListItem(opt)
  `
}

Multiselect.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  inputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  options: PropTypes.array.isRequired,
  value: PropTypes.array.isRequired,
  onSelect: PropTypes.func,
  onRemove: PropTypes.func,
  placeholder: PropTypes.string,
  focused: PropTypes.bool.isRequired,
  tagLimit: PropTypes.number,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  TagComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  renderListItem: PropTypes.func,
  onOpen: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  _hasError: PropTypes.bool // @private
}

export default observer(themed('Multiselect', Multiselect))
