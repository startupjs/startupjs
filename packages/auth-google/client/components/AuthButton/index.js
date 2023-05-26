import React from 'react'
import { observer } from 'startupjs'
import { Button } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { BASE_URL } from '@env'
import { onLogin } from '../../helpers'
import './index.styl'

function AuthButton ({
  style,
  label,
  ...options
}) {
  return pug`
    Button.button(
      style=style
      icon=faGoogle
      variant='flat'
      onPress=() => onLogin(options)
    )= label
  `
}

AuthButton.defaultProps = {
  label: 'Google',
  baseUrl: BASE_URL
}

AuthButton.propTypes = {
  label: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string,
  baseUrl: PropTypes.string.isRequired
}

export default observer(AuthButton)
