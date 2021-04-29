import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import Icon from '../../../../Icon'
import Menu from '../../../../Menu'
import Link from '../../../../Link'
import './index.styl'

function DropdownItem ({
  style,
  children,
  disabled,
  item,
  renderItem,
  _variant,
  _activeValue,
  _selectIndexValue,
  _index,
  _childrenLength,
  _onChange,
  _onDismissDropdown,
  _onLayout
}) {
  const handlePress = () => {
    if (item.action) {
      item.action()
      _onDismissDropdown()
    } else {
      _onChange(item.value)
    }
  }

  if (_variant === 'popover' && !renderItem) {
    return pug`
      Menu.Item(
        to=item.to
        style=style
        active=_activeValue === item.value
        disabled=disabled
        styleName={ selectMenu: _selectIndexValue === _index }
        onPress=handlePress
        icon=item.icon
      )= item.label
    `
  }

  const Wrapper = item.to ? Link : TouchableOpacity
  return pug`
    Wrapper(
      to=item.to
      style=style
      onPress=handlePress
    )
      View.item(styleName=[!renderItem && _variant, {
        active: !renderItem && (_activeValue === item.value),
        itemUp: !renderItem && (_index === 0),
        itemDown: !renderItem && (_index === _childrenLength - 1),
        selectMenu: _selectIndexValue === _index
      }])
        if renderItem
          = renderItem(item, _index, _selectIndexValue)
        else
          Text.itemText(styleName=[_variant, { active: _activeValue && _activeValue === item.value }])
            = item.label
          if _activeValue === item.value
            Icon.iconActive(styleName=_variant icon=faCheck)
  `
}

DropdownItem.defaultProps = {}

DropdownItem.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default observer(DropdownItem)
