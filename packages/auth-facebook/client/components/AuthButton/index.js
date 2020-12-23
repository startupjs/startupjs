import React from 'react'
import { Button } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'
import { onLogin } from '../../helpers'
import './index.styl'

function AuthButton ({ style, label, redirectUrl }) {
  return pug`
    Button.button(
      style=style
      onPress=() => onLogin(redirectUrl)
      icon=faFacebook
      variant='flat'
    )= label
  `
}

AuthButton.defaultProps = {
  label: 'Facebook'
}

AuthButton.propTypes = {
  label: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string
}

export default AuthButton
