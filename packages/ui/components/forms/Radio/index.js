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
  textColor,
  value,
  data,
  onChange
}) {
  const _color = colors[color] || color
  const _textColor = colors[textColor] || textColor

  function handleRadioPress (value) {
    return onChange && onChange(value)
  }

  let _children

  if (Array.isArray(children)) {
    _children = React.Children.map(children, (child) => {
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
      if data
        each el, index in data
          Input(
            checked=el.value === value
            color=_color
            textColor=_textColor
            value=el.value
            label=el.label
            key=index
            onPress=handleRadioPress
          )
  `
}

Radio.propTypes = {
  color: propTypes.string,
  textColor: propTypes.string,
  data: propTypes.arrayOf(propTypes.shape({
    value: propTypes.oneOfType([propTypes.string, propTypes.number]),
    label: propTypes.oneOfType([propTypes.string, propTypes.number])
  })),
  value: propTypes.oneOfType(propTypes.string, propTypes.number),
  onChange: propTypes.func
}

Radio.defaultProps = {
  size: 's',
  color: 'primary',
  textColor: colors.dark,

  data: [{ value: 'foo', label: 'foo' }, { value: 'bar', label: 'bar' }],
  value: 'bar'
}

export default observer(Radio)
