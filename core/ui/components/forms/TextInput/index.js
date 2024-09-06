import React from 'react'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import InputComponent from './input'
import Span from './../../typography/Span'
import './index.styl'

function TextInput ({
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
    InputComponent(
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
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  inputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  iconStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  secondaryIconStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  testID: PropTypes.string,
  value: PropTypes.string,
  size: PropTypes.oneOf(['l', 'm', 's']),
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  resize: PropTypes.bool,
  numberOfLines: PropTypes.number,
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.func, PropTypes.string]),
  iconPosition: PropTypes.oneOf(['left', 'right']),
  secondaryIcon: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onIconPress: PropTypes.func,
  onSecondaryIconPress: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChangeText: PropTypes.func,
  _renderWrapper: PropTypes.func, // @private
  _hasError: PropTypes.bool // @private
}

export default observer(TextInput, { forwardRef: true })
