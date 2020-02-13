import React from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Radio from './Radio'
import './index.styl'

const RadioGroup = function ({
  style,
  size,
  value,
  data,
  onChange
}) {
  function handleRadioPress (value) {
    return onChange && onChange(value)
  }

  return pug`
    View(style=style)
      each el, index in data
        Radio(
          checked=el.value === value
          disabled=el.disabled
          value=el.value
          label=el.label
          key=index
          size=size
          onPress=handleRadioPress
        )
  `
}

RadioGroup.propTypes = {
  data: propTypes.arrayOf(propTypes.shape({
    value: propTypes.oneOfType([propTypes.string, propTypes.number]),
    label: propTypes.oneOfType([propTypes.string, propTypes.number]),
    disabled: propTypes.bool
  })),
  size: propTypes.oneOf(['xxl', 'xl', 'l', 'm', 's', 'xs'])
}

RadioGroup.defaultProps = {
  size: 's',
  // remove
  data: [{ label: 'foo', value: 'foo' }, { label: 'bar', value: 'bar', disabled: true }],
  value: 'foo'
}

export default observer(RadioGroup)
