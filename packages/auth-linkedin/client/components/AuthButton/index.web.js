import React from 'react'
import { Button } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { onLogin } from '../../helpers'
import './index.styl'

function AuthButton ({ label, redirectUrl }) {
  return pug`
    Button.button(
      onPress=() => onLogin(redirectUrl)
      icon=faLinkedinIn
      variant='flat'
    )= label
  `
}

AuthButton.defaultProps = {
  label: 'LinkedIn'
}

AuthButton.propTypes = {
  label: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string
}

export default AuthButton
