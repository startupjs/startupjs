import React, { useState } from 'react'
import { pug, observer } from 'startupjs'
import { Div, Button, TextInput, Row, Span } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { checkToken } from '../../helpers'
import './index.styl'

function CheckToken ({
  style,
  label,
  onSuccess,
  onDismiss
}) {
  const [text, setText] = useState('')

  async function onCheckToken () {
    const isValid = await checkToken(text)

    if (isValid) {
      onSuccess && onSuccess()
    } else {
      onDismiss && onDismiss()
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
  onSuccess: PropTypes.func,
  onDismiss: PropTypes.func
}

export default observer(CheckToken)
