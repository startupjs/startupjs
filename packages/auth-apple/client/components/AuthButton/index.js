import React from 'react'
import { pug, observer, useSession } from 'startupjs'
import { Button } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { faApple } from '@fortawesome/free-brands-svg-icons'
import { BASE_URL } from '@env'
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
  const { clientId, testBaseUrl } = authConfig.apple || {}

  function _onLogin () {
    onLogin({
      clientId,
      testBaseUrl,
      baseUrl,
      redirectUrl,
      expiresRedirectUrl
    })
  }

  return pug`
    Button.button(
      style=style
      icon=faApple
      variant='flat'
      onPress=_onLogin
    )= label
  `
}

AuthButton.defaultProps = {
  label: 'Apple',
  baseUrl: BASE_URL
}

AuthButton.propTypes = {
  label: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string,
  baseUrl: PropTypes.string.isRequired
}

export default observer(AuthButton)
