import React from 'react'
import { Button } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { onLogin } from '../../helpers'
import './index.styl'

function AuthButton ({
  style,
  redirectUrl,
  label
}) {
  return pug`
    Button.button(
      style=style
      icon=faLinkedinIn
      variant='flat'
      onPress=() => onLogin({ redirectUrl })
    )= label
  `
}

AuthButton.defaultProps = {
  label: 'LinkedIn'
}

AuthButton.propTypes = {
  style: PropTypes.object,
  label: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string
}

export default AuthButton
