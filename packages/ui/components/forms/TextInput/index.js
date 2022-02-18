import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Input from './input'
import Span from './../../typography/Span'
import Div from './../../Div'
import './index.styl'

function TextInput ({
  style,
  value,
  readonly,
  _renderWrapper,
  ...props
}, ref) {
  if (!_renderWrapper) {
    _renderWrapper = ({ style }, children) => pug`
      Div(style=style)= children
    `
  }

  if (readonly) {
    return _renderWrapper({
      style: [style]
    }, pug`
      Span= value
    `)
  }

  return pug`
    Input(
      ref=ref
      value=value
      _renderWrapper=_renderWrapper
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
  placeholder: PropTypes.string,
  value: PropTypes.string,
  size: PropTypes.oneOf(['l', 'm', 's']),
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  resize: PropTypes.bool,
  numberOfLines: PropTypes.number,
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
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
