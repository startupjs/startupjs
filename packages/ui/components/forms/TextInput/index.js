import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Input from './input'
import Span from './../../typography/Span'
import themed from '../../../theming/themed'
import wrapInput from './../wrapInput'
import './index.styl'

function TextInput ({
  wrapperStyle,
  value,
  readonly,
  ...props
}, ref) {
  if (readonly) {
    return pug`
      Span= value
    `
  }

  return pug`
    Input(
      style=wrapperStyle
      ref=ref
      value=value
      ...props
    )
  `
}

TextInput.defaultProps = {
  size: 'm',
  value: '', // default value is important to prevent error
  disabled: false,
  readonly: false,
  resize: false,
  numberOfLines: 1,
  iconPosition: 'left'
}

TextInput.propTypes = {
  wrapperStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  inputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  iconStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  placeholder: PropTypes.string,
  value: PropTypes.string,
  size: PropTypes.oneOf(['l', 'm', 's']),
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  resize: PropTypes.bool,
  numberOfLines: PropTypes.number,
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  iconPosition: PropTypes.oneOf(['left', 'right']),
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChangeText: PropTypes.func,
  onIconPress: PropTypes.func,
  _renderWrapper: PropTypes.func, // @private
  _hasError: PropTypes.bool // @private
}

const ObservedTextInput = observer(
  themed('TextInput', TextInput),
  { forwardRef: true }
)

const WrappedObservedTextInput = wrapInput(
  ObservedTextInput,
  { rows: { descriptionPosition: 'bottom' } }
)

export default WrappedObservedTextInput
