import React from 'react'
import { observer } from 'startupjs'
import { Button } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { faMicrosoft } from '@fortawesome/free-brands-svg-icons'
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
      icon=faMicrosoft
      variant='flat'
      onPress=() => onLogin({ baseUrl, redirectUrl })
    )= label
  `
}

AuthButton.defaultProps = {
  label: 'Azure AD'
}

AuthButton.propTypes = {
  label: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string,
  baseUrl: PropTypes.string.isRequired
}

export default observer(AuthButton)
