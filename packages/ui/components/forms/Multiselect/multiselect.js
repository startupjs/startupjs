import React from 'react'
import { ScrollView } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Drawer from './../../popups/Drawer'

import MultiselectInput from './input'
import styles from './index.styl'

const Multiselect = ({
  options,
  value,
  placeholder,
  label,
  focused,
  disabled,
  error,
  TagComponent,
  renderListItem,
  onSelect,
  onRemove,
  onOpen,
  onHide
}) => {
  return pug`
    MultiselectInput(
      label=label
      onOpen=onOpen
      focused=focused
      value=value
      placeholder=placeholder
      options=options
      disabled=disabled
      error=error
      TagComponent=TagComponent
    )
    Drawer(
      visible=focused
      position='bottom'
      onDismiss=onHide
      styleSwipe=styles.swipeZone
      styleContent=styles.nativeListContent
    )
      ScrollView.suggestions-native
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
  disabled: PropTypes.bool,
  error: PropTypes.string,
  TagComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  renderListItem: PropTypes.func
}

export default observer(Multiselect)
