import React from 'react'
import { pug, observer, useSession } from 'startupjs'
import { Button } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
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

  function _onLogin () {
    onLogin({
      baseUrl,
      redirectUrl,
      expiresRedirectUrl
    })
  }

  return pug`
    Button.button(
      style=style
      icon=faLinkedinIn
      variant='flat'
      onPress=_onLogin
    )= label
  `
}

AuthButton.defaultProps = {
  label: 'LinkedIn'
}

AuthButton.propTypes = {
  style: PropTypes.object,
  baseUrl: PropTypes.string,
  label: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string
}

export default observer(AuthButton)
