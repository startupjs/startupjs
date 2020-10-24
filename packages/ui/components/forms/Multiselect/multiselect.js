import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import { FlatList } from 'react-native'
import { Drawer } from '@startupjs/ui'

import MultiselectInput from './input'
import styles from './index.styl'

const Multiselect = ({
  options,
  value,
  placeholder,
  label,
  showOptsMenu,
  hideOptsMenu,
  showOpts,
  disabled,
  error,
  TagComponent,
  renderListItem,
  onSelect,
  onRemove
}) => {
  return pug`
    MultiselectInput(
      label=label
      showOptsMenu=showOptsMenu
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
      onDismiss=hideOptsMenu
      styleSwipe=styles.swipeZone
      styleContent=styles.nativeListContent
    )
      FlatList(
        data=options
        renderItem=renderListItem
        keyExtractor=item => item.value
      )
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
  disabled: PropTypes.bool,
  error: PropTypes.string,
  TagComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  renderListItem: PropTypes.func
}

export default observer(Multiselect)
