import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import { FlatList } from 'react-native'
import { Div, Span, Checkbox, Drawer } from '@startupjs/ui'

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
  onSelect,
  onRemove
}) => {
  const selectCb = (selected, value) => () => {
    if (selected) {
      onRemove(value)
    } else {
      onSelect(value)
    }
  }

  function renderListItem ({ item }) {
    const selected = value.some(_value => _value === item.value)

    return pug`
      Div.suggestion(onPress=selectCb(selected, item.value))
        Checkbox.checkbox(value=selected)
        Span.sugText= item.label
    `
  }

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
  TagComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
}

export default observer(Multiselect)
