import React from 'react'
import { useSession } from 'startupjs'
import { Button } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { faApple } from '@fortawesome/free-brands-svg-icons'
import { onLogin } from '../../helpers'
import './index.styl'

function AuthButton ({ style, label, redirectUrl }) {
  const [authConfig] = useSession('auth')

  const { clientId, testBaseUrl } = authConfig.apple

  return pug`
    Button.button(
      style=style
      onPress=()=> onLogin({ clientId, testBaseUrl }, redirectUrl)
      icon=faApple
      variant='flat'
    )= label
  `
}

AuthButton.defaultProps = {
  label: 'Apple'
}

AuthButton.propTypes = {
  label: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string
}

export default AuthButton
