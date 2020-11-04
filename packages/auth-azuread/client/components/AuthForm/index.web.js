import React from 'react'
import { Button } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { faMicrosoft } from '@fortawesome/free-brands-svg-icons'
import { login } from '../../helpers'

function AuthForm ({ text }) {
  return pug`
    Button(
      onPress=login
      icon=faMicrosoft
      variant='flat'
    )= text
  `
}

AuthForm.defaultProps = {
  text: 'Login with Azure AD'
}

AuthForm.propTypes = {
  text: PropTypes.string.isRequired
}

export default AuthForm
