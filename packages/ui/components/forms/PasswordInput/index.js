import React, { useState } from 'react'
import { observer } from 'startupjs'
import pick from 'lodash/pick'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import TextInput from '../TextInput'

function PasswordInput ({ ...props }, ref) {
  const [textHidden, setTextHidden] = useState(true)

  return pug`
    TextInput(
      ...props
      ref=ref
      autoCompleteType='password'
      secureTextEntry=textHidden
      icon=textHidden ? faEye : faEyeSlash
      iconPosition='right'
      numberOfLines=1
      resize=false
      readonly=false
      onIconPress=() => setTextHidden(!textHidden)
    )
  `
}

PasswordInput.defaultProps = {
  ...pick(
    TextInput.defaultProps,
    [
      'size',
      'value',
      'disabled'
    ]
  )
}

PasswordInput.propTypes = {
  ...pick(
    TextInput.propTypes,
    [
      'style',
      'inputStyle',
      'placeholder',
      'value',
      'size',
      'disabled',
      'onFocus',
      'onBlur',
      'onChangeText',
      '_hasError'
    ]
  )
}

export default observer(PasswordInput, { forwardRef: true })
