import React, { useState } from 'react'
import { observer } from 'startupjs'
import { Div, Button, TextInput, Row, Span } from '@startupjs/ui'
import { checkToken } from '@startupjs/2fa'
import PropTypes from 'prop-types'
import './index.styl'

function CheckToken ({
  style,
  label,
  onSuccess
}) {
  const [text, setText] = useState('')

  async function onCheckToken () {
    const isValid = await checkToken(text)

    if (isValid) {
      onSuccess()
    }
  }

  return pug`
    Div.root(style=style)
      Span.label= label
      Row.inputContainer
        TextInput.input(
          value=text
          onChangeText=setText
        )
        Button.button(onPress=onCheckToken) Check
  `
}

CheckToken.defaultProps = {
  label: 'Enter your code:'
}

CheckToken.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  label: PropTypes.string,
  onSuccess: PropTypes.func
}

export default observer(CheckToken)
