import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from './../../Div'
import Input from './input'
import wrapInput from './../wrapInput'
import './index.styl'

function Radio ({
  wrapperStyle,
  inputStyle,
  children,
  value,
  options,
  onChange,
  _hasError,
  ...props
}) {
  function handleRadioPress (value) {
    return onChange && onChange(value)
  }

  const radios = options.length
    ? options.map((o) => {
      const checked = o.value === value
      const hasError = _hasError && (value ? checked : true)

      return pug`
        Input(
          style=inputStyle
          key=o.value
          checked=checked
          value=o.value
          onPress=handleRadioPress
          _hasError=hasError
          ...props
        )= o.label
      `
    })
    : React.Children.toArray(children).map((child) => {
      return React.cloneElement(child, {
        style: inputStyle,
        checked: child.props.value === value,
        onPress: value => handleRadioPress(value),
        ...props
      })
    })

  return pug`
    Div(style=[wrapperStyle])= radios
  `
}

Radio.defaultProps = {
  options: [],
  disabled: false,
  readonly: false
}

Radio.propTypes = {
  wrapperStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  inputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  // TODO: Also support pure values like in Select. Api should be the same.
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  onChange: PropTypes.func,
  _hasError: PropTypes.bool // @private
}

const ObservedRadio = observer(Radio)
const WrappedObservedRadio = wrapInput(ObservedRadio)

WrappedObservedRadio.Item = Input

export default WrappedObservedRadio
