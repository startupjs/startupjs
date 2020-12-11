import React from 'react'
import { useSession } from 'startupjs'
import { Button } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { faApple } from '@fortawesome/free-brands-svg-icons'
import { onLogin } from '../../helpers'
import './index.styl'

function AuthButton ({ style, label }) {
  const [authConfig] = useSession('auth')

  const { clientId } = authConfig.apple

  return pug`
    Button.button(
      style=style
      onPress=()=> onLogin(clientId)
      icon=faApple
      variant='flat'
    )= label
  `
}

AuthButton.defaultProps = {
  label: 'Login with Apple'
}

AuthButton.propTypes = {
  label: PropTypes.string.isRequired
}

export default AuthButton
