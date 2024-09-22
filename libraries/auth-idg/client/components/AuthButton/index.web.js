import React from 'react'
import { pug, observer, u, useSession } from 'startupjs'
import { Div, Span } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { onLogin } from '../../helpers'
import IDG from './img/IDG.svg'
import './index.styl'

function AuthButton ({
  style,
  label,
  baseUrl,
  redirectUrl
}) {
  const [authConfig] = useSession('auth')
  const { expiresRedirectUrl } = authConfig

  function _onLogin () {
    onLogin({
      baseUrl,
      redirectUrl,
      expiresRedirectUrl
    })
  }

  return pug`
    Div.button(
      style=style
      onPress=_onLogin
      row
    )
      IDG(
        viewBox="2 4 40 40"
        height=u(2)
        width=u(2)
      )
      Span.label= label
  `
}

AuthButton.defaultProps = {
  label: 'IDG'
}

AuthButton.propTypes = {
  label: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string
}

export default observer(AuthButton)
