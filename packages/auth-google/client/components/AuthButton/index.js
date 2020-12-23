import React from 'react'
import { Button } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { onLogin } from '../../helpers'
import './index.styl'

function AuthButton ({ style, label, redirectUrl }) {
  return pug`
    Button.button(
      style=style
      onPress=() => onLogin(redirectUrl)
      icon=faGoogle
      variant='flat'
    )= label
  `
}

AuthButton.defaultProps = {
  label: 'Google'
}

AuthButton.propTypes = {
  label: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string
}

export default AuthButton
