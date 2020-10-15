import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Input from './input'
import Div from './../../Div'
import './index.styl'

const Radio = function ({
  style,
  children,
  value,
  options,
  data, // DEPRECATED
  disabled,
  readonly,
  onChange
}) {
  // TODO: DEPRECATED! Remove!
  if (data) {
    options = data
    console.warn('DEPRECATION ERROR! [@startupjs/ui -> Radio] Use "options" instead of "data"')
  }

  function handleRadioPress (value) {
    return onChange && onChange(value)
  }

  const _children = options.length
    ? options.map((o) => {
      return pug`
        Input(
          readonly=readonly
          key=o.value
          checked=o.value === value
          value=o.value
          disabled=disabled || o.disabled
          onPress=handleRadioPress
        )= o.label
      `
    })
    : React.Children.toArray(children).map((child) => {
      return React.cloneElement(child, {
        checked: child.props.value === value,
        disabled,
        readonly,
        onPress: value => handleRadioPress(value)
      })
    })

  return pug`
    Div(style=style)
      = _children
  `
}

Radio.defaultProps = {
  options: [],
  disabled: false,
  readonly: false
}

Radio.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  // TODO: Also support pure values like in Select. Api should be the same.
  data: propTypes.arrayOf(propTypes.shape({
    value: propTypes.oneOfType([propTypes.string, propTypes.number]),
    label: propTypes.oneOfType([propTypes.string, propTypes.number])
  })),
  options: propTypes.array,
  disabled: propTypes.bool,
  readonly: propTypes.bool,
  value: propTypes.oneOfType([propTypes.string, propTypes.number]),
  onChange: propTypes.func
}

const ObservedRadio = observer(Radio)
ObservedRadio.Item = Input
export default ObservedRadio
