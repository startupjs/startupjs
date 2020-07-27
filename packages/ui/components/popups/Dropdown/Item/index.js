import React from 'react'
import propTypes from 'prop-types'
import { Text, View, TouchableOpacity } from 'react-native'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import Icon from '../../../Icon'
import Menu from '../../../Menu'
import './index.styl'

const DropdownItem = ({
  label,
  value,
  icon,
  onPress,
  children,
  _isPure,
  _activeValue,
  _variant,
  _onChange,
  _onDismissDropdown,
  _index,
  _childenLength
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress()
      _onDismissDropdown()
    } else {
      _onChange(value)
    }
  }

  if (_variant === 'popover' && _variant !== 'pure') {
    return pug`
      Menu.Item(
        active=_activeValue === value
        onPress=handlePress
        iconPosition='left'
        icon=icon
      )= label
    `
  }

  return pug`
    TouchableOpacity(onPress=handlePress)
      View.item(styleName=[!_isPure && _variant, {
        active: !_isPure && (_activeValue === value),
        itemUp: !_isPure && (_index === 0),
        itemDown: !_isPure && (_index === _childenLength - 1)
      }])
        if _isPure
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
  label: propTypes.string.isRequired,
  value: propTypes.string.isRequired
}

export default DropdownItem
