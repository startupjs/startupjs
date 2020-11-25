import React from 'react'
import { Button } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { faMicrosoft } from '@fortawesome/free-brands-svg-icons'
import { onLogin } from '../../helpers'

function AuthButton ({ label }) {
  return pug`
    Button(
      onPress=onLogin
      icon=faMicrosoft
      variant='flat'
    )= label
  `
}

AuthButton.defaultProps = {
  label: 'Login with Azure AD'
}

AuthButton.propTypes = {
  label: PropTypes.string.isRequired
}

export default AuthButton
