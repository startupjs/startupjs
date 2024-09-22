import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import Icon from '../../../../Icon'
import Menu from '../../../../Menu'
import Link from '../../../../Link'
import themed from '../../../../../theming/themed'
import './index.styl'

function DropdownItem ({
  style,
  to,
  label,
  value,
  icon,
  disabled,
  onPress,
  children,
  _activeValue,
  _selectIndexValue,
  _variant,
  _onChange,
  _onDismissDropdown,
  _index,
  _childrenLength
}) {
  const isPure = _variant === 'pure'

  const handlePress = () => {
    if (onPress) {
      onPress()
      _onDismissDropdown()
    } else {
      _onChange(value)
    }
  }

  if (_variant === 'popover' && !isPure) {
    return pug`
      Menu.Item(
        to=to
        style=style
        active=_activeValue === value
        disabled=disabled
        styleName={ selectMenu: _selectIndexValue === _index }
        onPress=handlePress
        icon=icon
      )= label
    `
  }

  const Wrapper = to ? Link : TouchableOpacity
  return pug`
    Wrapper(
      to=to
      style=style
      onPress=handlePress
    )
      View.item(styleName=[!isPure && _variant, {
        active: !isPure && (_activeValue === value),
        itemUp: !isPure && (_index === 0),
        itemDown: !isPure && (_index === _childrenLength - 1),
        selectMenu: _selectIndexValue === _index
      }])
        if isPure
          = children
        else
          Text.itemText(styleName=[_variant, { active: _activeValue && _activeValue === value }])
            = label
          if _activeValue === value
            Icon.iconActive(styleName=_variant icon=faCheck)
  `
}

DropdownItem.defaultProps = {}

DropdownItem.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default observer(themed('DropdownItem', DropdownItem))
