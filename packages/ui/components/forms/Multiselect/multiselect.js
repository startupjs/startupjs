import React from 'react'
import { ScrollView } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Drawer from './../../popups/Drawer'
import MultiselectInput from './input'
import themed from '../../../theming/themed'
import styles from './index.styl'

const Multiselect = ({
  style,
  inputStyle,
  options,
  value,
  placeholder,
  focused,
  disabled,
  tagLimit,
  InputComponent,
  TagComponent,
  renderListItem,
  onSelect,
  onRemove,
  onOpen,
  onHide,
  _hasError
}, ref) => {
  return pug`
    MultiselectInput(
      ref=ref
      style=inputStyle
      onOpen=onOpen
      onHide=onHide
      focused=focused
      value=value
      placeholder=placeholder
      tagLimit=tagLimit
      options=options
      disabled=disabled
      InputComponent=InputComponent
      TagComponent=TagComponent
      _hasError=_hasError
    )
    Drawer.nativeListContent(
      style=style
      visible=focused
      position='bottom'
      onDismiss=onHide
      styleSwipe=styles.swipeZone
    )
      ScrollView.suggestions-native
        each option, index in options
          = renderListItem({ item: option, index })

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
  onOpen: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  focused: PropTypes.bool.isRequired,
  tagLimit: PropTypes.number,
  disabled: PropTypes.bool,
  InputComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  TagComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  renderListItem: PropTypes.func,
  _hasError: PropTypes.bool // @private
}

export default observer(
  themed('Multiselect', Multiselect),
  { forwardRef: true }
)
