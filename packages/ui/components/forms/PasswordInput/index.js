import React, { useState } from 'react'
import { observer } from 'startupjs'
import pick from 'lodash/pick'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import TextInput from '../TextInput'
import themed from '../../../theming/themed'

function PasswordInput ({ ...props }) {
  const [textHidden, setTextHidden] = useState(true)

  return pug`
    TextInput(
      ...props
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
      'disabled',
      'options'
    ]
  )
}

PasswordInput.propTypes = {
  ...pick(
    TextInput.propTypes,
    [
      'style',
      'wrapperStyle',
      'inputStyle',
      'label',
      'description',
      'layout',
      'options',
      'error',
      'value',
      'placeholder',
      'size',
      'disabled',
      'onFocus',
      'onBlur',
      'onChangeText'
    ]
  )
}

export default observer(themed(PasswordInput))
