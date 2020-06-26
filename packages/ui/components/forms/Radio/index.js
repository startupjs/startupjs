import React from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Input from './input'
import config from '../../../config/rootConfig'
import './index.styl'

const { colors } = config

const Radio = function ({
  style,
  children,
  color,
  checkedColor,
  textColor,
  value,
  options,
  data,
  onChange
}) {
  // TODO: DEPRECATED! Remove!
  if (data) {
    options = data
    console.warn('DEPRECATION ERROR! [@startupjs/ui -> Radio] Use "options" instead of "data"')
  }
  const _color = colors[color] || color
  const _checkedColor = colors[checkedColor] || checkedColor
  const _textColor = colors[textColor] || textColor

  function handleRadioPress (value) {
    return onChange && onChange(value)
  }

  let _children

  if (Array.isArray(children)) {
    _children = React.Children.toArray(children).map((child) => {
      const { value: _value } = child.props
      const _child = React.cloneElement(
        child,
        {
          onPress: () => handleRadioPress(_value),
          checked: _value === value
        }
      )
      return _child
    })
  }

  return pug`
    View(style=style)
      if _children
        = _children
      each el, index in options
        - const checked = el.value === value
        Input(
          checked=checked
          color=checked ? _checkedColor : _color
          textColor=_textColor
          value=el.value
          label=el.label
          key=index
          onPress=handleRadioPress
        )
  `
}

Radio.defaultProps = {
  color: 'dark',
  checkedColor: 'primary',
  textColor: colors.dark,
  options: []
}

Radio.propTypes = {
  color: propTypes.string,
  textColor: propTypes.string,
  // TODO: Also support pure values like in Select. Api should be the same.
  data: propTypes.arrayOf(propTypes.shape({
    value: propTypes.oneOfType([propTypes.string, propTypes.number]),
    label: propTypes.oneOfType([propTypes.string, propTypes.number])
  })),
  value: propTypes.oneOfType([propTypes.string, propTypes.number]),
  onChange: propTypes.func
}

export default observer(Radio)
