import React from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from '../Div'
import Span from '../Span'
import './index.styl'

const Radio = function ({
  value,
  label,
  checked,
  size,
  disabled,
  onPress,
  children
}) {
  const CircleIcon = ({ checked, disabled }) => pug`
    View.circle(
      styleName=[size, { disabled, 'with-label': !!label }]
    )
      if checked
        View.checked(
          styleName=[size, {disabled}]
        )
  `

  const setChecked = () => {
    if (disabled) return
    onPress && onPress(value)
  }

  return pug`
    Div.root(
      styleName=[size, {disabled}]
      disabled=disabled
      onPress=setChecked
    )
      CircleIcon(checked=checked disabled=disabled)
      Span.label(styleName={disabled} size=size)= label
  `
}

Radio.defaultProps = {
  size: 's'
}

Radio.propType = {
  checked: PropTypes.bool,
  size: PropTypes.oneOf(['xxl', 'xl', 'l', 'm', 's', 'xs']),
  disabled: PropTypes.bool
}

export default observer(Radio)
