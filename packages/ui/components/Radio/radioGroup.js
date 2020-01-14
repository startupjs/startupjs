import React from 'react'
import { observer } from 'startupjs'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import Radio from './radio'
import './index.styl'

const RadioGroup = function ({ children, onChange, activeOpacity, value, data, style }) {
  const handleRadioPress = value => onChange && onChange(value)

  const _children = Array.isArray(data) ? pug`
    each el in data
      Radio(
        checked=el.value === value
        onPress=handleRadioPress
        disable=el.disable
        activeOpacity=activeOpacity
        value=el.value
        key=el.value || el.label
      )
        = el.label
  ` : React.Children.toArray(children).map(child => {
    return React.cloneElement(child, {
      checked: child.props.value === value,
      onPress: value => handleRadioPress(value)
    })
  })

  return pug`
    View(style=style)
      = _children
  `
}

RadioGroup.defaultProps = {
  activeOpacity: 0
}

RadioGroup.propTypes = {
  activeOpacity: PropTypes.number
}

export default observer(RadioGroup)
