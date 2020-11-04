import React from 'react'
import { Button } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { login } from '../../helpers'

function AuthForm ({ text }) {
  return pug`
    Button(
      onPress=login
      icon=faLinkedinIn
      variant='flat'
    )= text
  `
}

AuthForm.defaultProps = {
  text: 'Login with LinkedIn'
}

AuthForm.propTypes = {
  text: PropTypes.string.isRequired
}

export default AuthForm
