import React, { useState } from 'react'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import TextInput from '../TextInput'

export default function PasswordInput ({
  secureTextEntry = false,
  ...props
}) {
  const [showText, setShowText] = useState(secureTextEntry)

  return pug`
    TextInput(
      ...props
      secureTextEntry=!showText
      icon=showText ? faEyeSlash : faEye
      iconPosition='right'
      onIconPress=() => setShowText(!showText)
    )
  `
}
