import React from 'react'
import { Image } from 'react-native'
import { pug, observer, useSession } from 'startupjs'
import { Span, Div } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { BASE_URL } from '@env'
import { onLogin } from '../../helpers'
import './index.styl'

function AuthButton ({
  style,
  label,
  baseUrl,
  providerName,
  imageUrl,
  redirectUrl
}) {
  const [authConfig] = useSession('auth')
  const { expiresRedirectUrl } = authConfig

  function _onLogin () {
    onLogin({
      baseUrl,
      providerName,
      redirectUrl,
      expiresRedirectUrl
    })
  }

  return pug`
    Div.button(
      style=style
      onPress=_onLogin
    )
      if imageUrl
        Image.image(
          resizeMode='contain'
          source={ uri: imageUrl }
        )
      Span.label= label
  `
}

AuthButton.defaultProps = {
  label: 'Login',
  baseUrl: BASE_URL
}

AuthButton.propTypes = {
  imageUrl: PropTypes.string,
  providerName: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string,
  baseUrl: PropTypes.string.isRequired
}

export default observer(AuthButton)
