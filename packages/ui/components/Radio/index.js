import React from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Input from './input'
import './index.styl'

const Radio = function ({
  style,
  children,
  value,
  data,
  onChange
}) {
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
      else
        each el, index in data
          Input(
            checked=el.value === value
            value=el.value
            label=el.label
            key=index
            onPress=handleRadioPress
          )
  `
}

Radio.propTypes = {
  data: propTypes.arrayOf(propTypes.shape({
    value: propTypes.oneOfType([propTypes.string, propTypes.number]),
    label: propTypes.oneOfType([propTypes.string, propTypes.number])
  })),
  value: propTypes.string, // propTypes.oneOfType(propTypes.string, propTypes.number)
  onChange: propTypes.func
}

Radio.defaultProps = {
  size: 's',
  onChange: (q) => console.log(q),
  // remove
  data: [{ label: 'foo', value: 'foo' }, { label: 'bar', value: 'bar' }],
  value: 'foo'
}

export default observer(Radio)
