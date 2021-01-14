import React from 'react'
import { Button } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { BASE_URL } from '@env'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'
import { onLogin } from '../../helpers'
import './index.styl'

function AuthButton ({ baseUrl, style, label, redirectUrl }) {
  return pug`
    Button.button(
      style=style
      onPress=() => onLogin(baseUrl, redirectUrl)
      icon=faFacebook
      variant='flat'
    )= label
  `
}

AuthButton.defaultProps = {
  label: 'Facebook',
  baseUrl: BASE_URL
}

AuthButton.propTypes = {
  label: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string,
  baseUrl: PropTypes.string.isRequired
}

export default AuthButton
