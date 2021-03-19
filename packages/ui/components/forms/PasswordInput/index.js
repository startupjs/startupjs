import React, { useState } from 'react'
import { observer } from 'startupjs'
import omit from 'lodash/omit'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import TextInput from '../TextInput'

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
      onIconPress=() => setTextHidden(!textHidden)
    )
  `
}

PasswordInput.defaultProps = {
  ...TextInput.defaultProps
}

PasswordInput.propTypes = {
  ...omit(TextInput.propTypes, ['icon', 'iconPosition', 'numberOfLines', 'resize', 'onIconPress'])
}

export default observer(PasswordInput)
