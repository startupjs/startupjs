import React from 'react'
import { useSession } from 'startupjs'
import { Button } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { faApple } from '@fortawesome/free-brands-svg-icons'
import { onLogin } from '../../helpers'
import './index.styl'

function AuthButton ({
  style,
  baseUrl,
  redirectUrl,
  label
}) {
  const [authConfig] = useSession('auth')
  const { clientId, testBaseUrl } = authConfig.apple

  return pug`
    Button.button(
      style=style
      icon=faApple
      variant='flat'
      onPress=()=> onLogin({ clientId, testBaseUrl, baseUrl, redirectUrl })
    )= label
  `
}

AuthButton.defaultProps = {
  label: 'Apple'
}

AuthButton.propTypes = {
  label: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string,
  baseUrl: PropTypes.string.isRequired
}

export default AuthButton
