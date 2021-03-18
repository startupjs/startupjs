import React, { useEffect, useState } from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import omit from 'lodash/omit'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import TextInput from '../TextInput'

function PasswordInput ({ secureTextEntry, ...props }) {
  const [textHidden, setTextHidden] = useState(true)

  useEffect(() => {
    // HACK: it is important for the WEB to pass by default
    // the secureTextEntry=true property to the TextInput,
    // because the field will not automatically accept
    // the password stored for the domain
    if (typeof secureTextEntry === 'boolean') setTextHidden(secureTextEntry)
  }, [secureTextEntry])

  return pug`
    TextInput(
      ...props
      autoCompleteType='password'
      secureTextEntry=textHidden
      icon=textHidden ? faEye : faEyeSlash
      iconPosition='right'
      onIconPress=() => setTextHidden(!textHidden)
    )
  `
}

PasswordInput.propTypes = {
  ...omit(TextInput.propTypes, ['icon', 'iconPosition', 'numberOfLines', 'resize', 'onIconPress']),
  secureTextEntry: PropTypes.bool
}

export default observer(PasswordInput)
