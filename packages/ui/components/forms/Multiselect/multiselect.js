import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import { ScrollView } from 'react-native'
import { Drawer } from '@startupjs/ui'

import MultiselectInput from './input'
import styles from './index.styl'

const Multiselect = ({
  options,
  value,
  placeholder,
  label,
  showOpts,
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
      showOpts=showOpts
      value=value
      placeholder=placeholder
      options=options
      disabled=disabled
      error=error
      TagComponent=TagComponent
    )
    Drawer(
      visible=showOpts
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
  showOpts: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  TagComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  renderListItem: PropTypes.func
}

export default observer(Multiselect)
