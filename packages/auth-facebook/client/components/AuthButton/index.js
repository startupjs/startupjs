import React from 'react'
import { Button } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'
import { onLogin } from '../../helpers'
import './index.styl'

function AuthButton ({
  style,
  baseUrl,
  redirectUrl,
  label
}) {
  return pug`
    Button.button(
      style=style
      icon=faFacebook
      variant='flat'
      onPress=() => onLogin({ baseUrl, redirectUrl })
    )= label
  `
}

AuthButton.defaultProps = {
  label: 'Facebook'
}

AuthButton.propTypes = {
  label: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string,
  baseUrl: PropTypes.string.isRequired
}

export default AuthButton
