import React, { useState, useEffect } from 'react'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
/* eslint-disable-next-line */
import { Row, Span, TextInput as _TextInput } from '@startupjs/ui'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import './index.styl'

function TextInput ({
  label,
  name,
  onChangeText,
  placeholder,
  error: errorFromParent,
  value,
  secureTextEntry
}) {
  const [showPass, setShowPass] = useState(secureTextEntry)
  const [error, setError] = useState(null)
  const togglePassVisibility = () => setShowPass(!showPass)

  useEffect(() => {
    setError(errorFromParent)
  }, [errorFromParent])
  return pug`
    Row.root
      _TextInput(
        label=label
        placeholder=placeholder
        onChangeText=onChangeText
        value=value
        secureTextEntry=showPass
        icon=secureTextEntry ? showPass ? faEye : faEyeSlash : undefined
        iconPosition='right'
        onIconPress=togglePassVisibility
      )
    if error
      Row.error
        Span.errorMsg
          = error
  `
}

TextInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  onChangeText: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  value: PropTypes.string,
  secureTextEntry: PropTypes.bool
}

export default observer(TextInput)
