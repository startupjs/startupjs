import React from 'react'
import { Button, Link } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'
import { WEB_LOGIN_URL } from '../../../isomorphic/constants'
import './index.styl'

function AuthButton ({ style, label }) {
  return pug`
    Link.link(to=WEB_LOGIN_URL style=style)
      Button.button(icon=faFacebook variant='flat')
        = label
  `
}

AuthButton.defaultProps = {
  label: 'Login with Facebook'
}

AuthButton.propTypes = {
  label: PropTypes.string.isRequired
}

export default AuthButton
