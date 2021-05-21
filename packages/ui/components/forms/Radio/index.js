import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Input from './input'
import Div from './../../Div'
import themed from '../../theming/themed'
import './index.styl'

function Radio ({
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
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  // TODO: Also support pure values like in Select. Api should be the same.
  data: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  options: PropTypes.array,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  onChange: PropTypes.func
}

const ObservedRadio = observer(themed(Radio))

ObservedRadio.Item = Input

export default ObservedRadio
