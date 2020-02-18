import React from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from '../Div'
import Span from '../Span'
import './index.styl'

const Input = function ({
  value,
  label,
  checked,
  onPress,
  children
}) {
  const CircleIcon = ({ checked }) => pug`
    View.circle(
      styleName={ 'with-label': !!label }
    )
      if checked
        View.checked
  `

  const setChecked = () => {
    onPress && onPress(value)
  }

  return pug`
    Div.root(
      onPress=setChecked
    )
      CircleIcon(checked=checked)
      Span.label= label
  `
}

Input.propType = {
  checked: PropTypes.bool
}

export default observer(Input)
