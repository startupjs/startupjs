import React from 'react'
import { observer, useSession, useLocal } from 'startupjs'
import { Button } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { onLogin } from '../../helpers'
import './index.styl'

function AuthButton ({
  style,
  baseUrl,
  redirectUrl,
  label
}) {
  const [authConfig] = useSession('auth')
  const { expiresRedirectUrl } = authConfig
  const [email] = useLocal('$render.query.email')

  function _onLogin () {
    onLogin({
      baseUrl,
      redirectUrl,
      expiresRedirectUrl,
      email
    })
  }

  return pug`
    Button.button(
      style=style
      icon=faGoogle
      variant='flat'
      onPress=_onLogin
    )= label
  `
}

AuthButton.defaultProps = {
  label: 'Google'
}

AuthButton.propTypes = {
  label: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string,
  baseUrl: PropTypes.string.isRequired
}

export default observer(AuthButton)
