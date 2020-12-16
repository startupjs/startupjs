import React from 'react'
import { Button } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { onLogin } from '../../helpers'
import './index.styl'

function AuthButton ({ style, label }) {
  return pug`
    Button.button(
      style=style
      onPress=onLogin
      icon=faGoogle
      variant='flat'
    )= label
  `
}

AuthButton.defaultProps = {
  label: 'Google'
}

AuthButton.propTypes = {
  label: PropTypes.string.isRequired
}

export default AuthButton
